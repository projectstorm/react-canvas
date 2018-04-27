import { AbstractElementFactory } from "./AbstractElementFactory";
import { SquareElementFactory } from "./primitives/square/SquareElementFactory";
import { CanvasModel } from "./models-canvas/CanvasModel";
import { CanvasWidget } from "./widgets/CanvasWidget";
import { SelectionElementFactory } from "./primitives/selection/SelectionElementFactory";
import { StateMachine } from "./state-machine/StateMachine";
import { TranslateCanvasState } from "./state-machine/states/TranslateCanvasState";
import * as _ from "lodash";
import { GridElementFactory } from "./primitives/grid/GridElementFactory";
import { CircleElementFactory } from "./primitives/circle/CircleElementFactory";
import { TranslateElementState } from "./state-machine/states/TranslateElementState";
import { SelectElementsState } from "./state-machine/states/SelectElementsState";
import { HistoryBank } from "./history/HistoryBank";
import { BaseModel } from "./models/BaseModel";
import { CanvasLayerFactory } from "./CanvasLayerFactory";
import { EventBus } from "./event-bus/EventBus";
import { ZoomCanvasAction } from "./event-bus/actions/ZoomCanvasAction";
import { MouseDownInput } from "./state-machine/input/MouseDownInput";
import { KeyInput } from "./state-machine/input/KeyInput";
import { SelectCanvasAction } from "./event-bus/actions/SelectCanvasAction";
import { SelectElementAction } from "./event-bus/actions/SelectElementAction";
import { ModelElementInput } from "./state-machine/input/ModelElementInput";
import { DefaultState } from "./state-machine/states/DefaultState";

export class CanvasEngineError extends Error {}

export class CanvasEngine {
	protected elementFactories: { [type: string]: AbstractElementFactory };
	protected model: CanvasModel;
	protected stateMachine: StateMachine;
	protected canvasWidget;
	protected historyBank: HistoryBank;
	protected eventBus: EventBus;

	constructor() {
		this.elementFactories = {};
		this.model = null;
		this.canvasWidget = null;
		this.stateMachine = new StateMachine();
		this.historyBank = new HistoryBank();
		this.eventBus = new EventBus();
	}

	getEventBus(): EventBus {
		return this.eventBus;
	}

	getHistoryBank(): HistoryBank {
		return this.historyBank;
	}

	getStateMachine(): StateMachine {
		return this.stateMachine;
	}

	setModel(model: CanvasModel) {
		this.model = model;
	}

	getModel(): CanvasModel {
		return this.model;
	}

	generateEntityFor(type: string): BaseModel {
		return this.elementFactories[type].generateModel();
	}

	deserialize(state: any) {
		this.model.deSerialize(state, this, {});
		this.canvasWidget.forceUpdate();
	}

	installHistoryBank() {
		this.stateMachine.addListener({
			stateChanged: event => {
				this.historyBank.pushState(this.model.serialize());
			}
		});
		this.historyBank.addListener({
			forward: event => {
				this.deserialize(event.state);
			},
			backward: event => {
				this.deserialize(event.state);
			}
		});
	}

	registerElementFactory(factory: AbstractElementFactory) {
		this.elementFactories[factory.type] = factory;
		factory.setEngine(this);
		_.forEach(factory.getCanvasStates(), state => {
			this.stateMachine.addState(state);
		});
	}

	installDefaults() {
		// element factories
		this.registerElementFactory(new CanvasLayerFactory());
		this.registerElementFactory(new SquareElementFactory());
		this.registerElementFactory(new SelectionElementFactory());
		this.registerElementFactory(new GridElementFactory());
		this.registerElementFactory(new CircleElementFactory());

		// install actions
		KeyInput.installActions(this.stateMachine, this.eventBus);
		MouseDownInput.installActions(this.stateMachine, this.eventBus);
		ModelElementInput.installActions(this.stateMachine, this.eventBus);
		this.eventBus.registerAction(new ZoomCanvasAction(this));

		// possible states
		this.stateMachine.addState(new SelectElementsState(this));
		this.stateMachine.addState(new TranslateElementState(this));
		this.stateMachine.addState(new TranslateCanvasState(this));
		this.stateMachine.addState(new DefaultState(this));

		this.stateMachine.process();
	}

	getCanvasWidget(): CanvasWidget {
		return this.canvasWidget;
	}

	setCanvasWidget(widget: CanvasWidget) {
		this.canvasWidget = widget;
		this.historyBank.pushState(this.model.serialize());
	}

	getFactory(type: string): AbstractElementFactory {
		if (!this.elementFactories[type]) {
			throw new CanvasEngineError("Cannot find Element factory with type: " + type);
		}
		return this.elementFactories[type];
	}

	getFactoryForElement(element: BaseModel): AbstractElementFactory {
		return this.getFactory(element.type);
	}
}
