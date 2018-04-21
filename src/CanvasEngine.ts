import { AbstractElementFactory } from "./AbstractElementFactory";
import { SquareElementFactory } from "./primitives/square/SquareElementFactory";
import { CanvasElementModel } from "./models-canvas/CanvasElementModel";
import { CanvasModel } from "./models-canvas/CanvasModel";
import { CanvasWidget } from "./widgets/CanvasWidget";
import { SelectionElementFactory } from "./primitives/selection/SelectionElementFactory";
import { StateMachine } from "./state-machine/StateMachine";
import { TranslateCanvasState } from "./state-machine/states/TranslateCanvasState";
import { ZoomCanvasState } from "./state-machine/states/ZoomCanvasState";
import * as _ from "lodash";
import { GridElementFactory } from "./primitives/grid/GridElementFactory";
import { CircleElementFactory } from "./primitives/circle/CircleElementFactory";
import { TranslateElementState } from "./state-machine/states/TranslateElementState";
import { SelectElementState } from "./state-machine/states/SelectElementState";
import {StateMachineReducer} from "./state-machine/StateMachineReducer";
import {SelectCanvasState} from "./state-machine/states/SelectCanvasState";
import {SelectElementsState} from "./state-machine/states/SelectElementsState";
import {HistoryBank} from "./history/HistoryBank";

export class CanvasEngineError extends Error {}

export class CanvasEngine {
	protected elementFactories: { [type: string]: AbstractElementFactory };
	protected model: CanvasModel;
	protected stateMachine: StateMachine;
	protected canvasWidget;
	protected historyBank: HistoryBank;

	constructor() {
		this.elementFactories = {};
		this.model = null;
		this.canvasWidget = null;
		this.stateMachine = new StateMachine();
		this.historyBank = new HistoryBank();
	}

	getHistoryBank(): HistoryBank{
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

	generateEntityFor(type: string){
		return this.elementFactories[type].generateModel();
	}

	deserialize(state: any){
		this.model.deSerialize(state, this);
		this.canvasWidget.forceUpdate();
	}

	installHistoryBank(){
		this.stateMachine.addListener({
			stateChanged: (event) => {
				this.historyBank.pushState(this.model.serialize());
			}
		});
		this.historyBank.addListener({
			forward: (event) => {
				this.deserialize(event.state);
			},
			backward: (event) => {
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
		this.registerElementFactory(new SquareElementFactory());
		this.registerElementFactory(new SelectionElementFactory());
		this.registerElementFactory(new GridElementFactory());
		this.registerElementFactory(new CircleElementFactory());

		// possible states
		this.stateMachine.addState(new TranslateElementState(this));
		this.stateMachine.addState(new SelectElementState(this));
		this.stateMachine.addState(new SelectElementsState(this));
		this.stateMachine.addState(new TranslateCanvasState(this));
		this.stateMachine.addState(new ZoomCanvasState(this));
		this.stateMachine.addState(new SelectCanvasState(this));

		// ordered rules for selecting elements
		this.stateMachine.addReducer(new StateMachineReducer([
			SelectElementsState.NAME,
			SelectElementState.NAME,
			SelectCanvasState.NAME,
		]));
	}

	getCanvasWidget(): CanvasWidget {
		return this.canvasWidget;
	}

	setCanvasWidget(widget: CanvasWidget) {
		this.canvasWidget = widget;
		this.historyBank.pushState(this.model.serialize());
	}

	getFactoryForElement(element: CanvasElementModel): AbstractElementFactory {
		if (!this.elementFactories[element.type]) {
			throw new CanvasEngineError("Cannot find Element factory with name: " + element.type);
		}
		return this.elementFactories[element.type];
	}
}
