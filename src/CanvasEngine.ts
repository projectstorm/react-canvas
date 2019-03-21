import * as _ from 'lodash';
import { AbstractElementFactory } from './AbstractElementFactory';
import { RectangleElementFactory } from './primitives/rectangle/RectangleElementFactory';
import { CanvasModel } from './models-canvas/CanvasModel';
import { CanvasWidget } from './widgets/CanvasWidget';
import { SelectionElementFactory } from './primitives/selection/SelectionElementFactory';
import { StateMachine } from './state-machine/StateMachine';
import { TranslateCanvasState } from './state-machine/states/TranslateCanvasState';
import { GridElementFactory } from './primitives/grid/GridElementFactory';
import { EllipseElementFactory } from './primitives/ellipse/EllipseElementFactory';
import { TranslateElementState } from './state-machine/states/TranslateElementState';
import { SelectElementsState } from './state-machine/states/SelectElementsState';
import { HistoryBank } from './history/HistoryBank';
import { CanvasLayerFactory } from './CanvasLayerFactory';
import { EventBus } from './event-bus/EventBus';
import { ZoomCanvasAction } from './event-bus/actions/ZoomCanvasAction';
import { MouseDownInput } from './state-machine/input/MouseDownInput';
import { KeyInput } from './state-machine/input/KeyInput';
import { ModelElementInput } from './state-machine/input/ModelElementInput';
import { DefaultState } from './state-machine/states/DefaultState';
import { Toolkit } from '@projectstorm/react-core';
import { CanvasLayerModel } from './models-canvas/CanvasLayerModel';
import { SelectionElementModel } from './primitives/selection/SelectionElementModel';
import { ModelEvent } from './event-bus/events/ModelEvent';
import { InlineAction } from './event-bus/InlineAction';
import { PaperElementFactory } from './primitives/paper/PaperElementFactory';
import { BaseEvent, BaseObject } from '@projectstorm/react-core';
import { BaseModel, DeserializeEvent } from './base-models/BaseModel';
import { EllipseElementModel } from './primitives/ellipse/EllipseElementModel';
import { DeselectModelsAction } from './event-bus/actions/DeselectModelsAction';

export class CanvasEngineError extends Error {}

export interface CanvasEngineListener<T> {
	modelChanged?: (event: BaseEvent & { model: T; oldModel: T }) => any;
}

export class CanvasEngine<T extends CanvasModel = CanvasModel> extends BaseObject<CanvasEngineListener<T>> {
	protected elementFactories: { [type: string]: AbstractElementFactory };
	protected model: T;
	protected stateMachine: StateMachine;
	protected canvasWidget;
	protected historyBank: HistoryBank;
	protected eventBus: EventBus;
	protected debugMode: boolean;

	private modelListener: string;
	debugLayer: CanvasLayerModel;

	constructor() {
		super();
		this.elementFactories = {};
		this.model = null;
		this.canvasWidget = null;
		this.stateMachine = new StateMachine();
		this.historyBank = new HistoryBank();
		this.eventBus = new EventBus();
		this.modelListener = null;
		this.debugMode = false;

		if (Toolkit.TESTING) {
			Toolkit.TESTING_UID = 0;
		}
	}

	enableDebugMode(debug: boolean) {
		this.debugMode = debug;
		if (debug) {
			// debug layer
			this.debugLayer = new CanvasLayerModel();
			this.debugLayer.setSVG(true);
			this.debugLayer.setTransformable(true);
		}
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

	setModel(model: T) {
		// uninstall the old model
		if (this.modelListener) {
			this.model.removeListener(this.modelListener);
		}
		let oldModel = this.model;
		this.model = model;
		this.iterateListeners('Model changed', (listener, event) => {
			if (listener.modelChanged) {
				listener.modelChanged({ ...event, model: model, oldModel: oldModel });
			}
		});

		// install the new model
		if (model) {
			this.modelListener = model.addListener({
				delegateEvent: event => {
					this.eventBus.fireEvent(new ModelEvent(event));
				}
			});
		} else {
			this.modelListener = null;
		}
	}

	getModel(): T {
		return this.model;
	}

	generateEntityFor(type: string): BaseModel {
		return this.elementFactories[type].generateModel();
	}

	deserialize(data: any) {
		let event = new DeserializeEvent(data, this);
		this.model.deSerialize(event);
		this.canvasWidget.forceUpdate();
	}

	installHistoryBank() {
		this.stateMachine.addListener({
			stateChanged: event => {
				if (this.model) {
					this.historyBank.pushState(this.model.serialize());
				}
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

	repaint() {
		if (this.canvasWidget) {
			if (this.debugMode) {
				this.model.layers.moveModelToFront(this.debugLayer);
				this.debugLayer.clearEntities();
				_.forEach(this.model.getElements(), element => {
					let dimensions = element.getDimensions();
					if (dimensions) {
						this.debugLayer.addModels(
							_.map(EllipseElementModel.createPointCloudFrom(dimensions, 3 / this.model.getZoomLevel()), point => {
								point.background = 'mediumpurple';
								return point;
							})
						);
					}
				});
			}

			this.canvasWidget.forceUpdate();
		}
	}

	installDefaultInteractivity() {
		// selection layer
		let selectionLayer = new CanvasLayerModel();
		selectionLayer.setSVG(false);
		selectionLayer.setTransformable(false);

		// listen for a new model
		this.addListener({
			modelChanged: event => {
				if (event.oldModel) {
					event.oldModel.removeLayer(selectionLayer);
					if (this.debugLayer) {
						event.oldModel.removeLayer(this.debugLayer);
					}
				}
				if (event.model) {
					event.model.addLayer(selectionLayer);
					if (this.debugLayer) {
						event.model.addLayer(this.debugLayer);
					}
				}
			}
		});

		this.eventBus.registerAction(
			new InlineAction(ModelEvent.NAME, (event: ModelEvent) => {
				// setup a combo box for when there are models
				if (event.modelEvent.name === 'selection changed') {
					selectionLayer.clearEntities();
					this.model.layers.moveModelToFront(selectionLayer);
					let selected = _.filter(this.model.getElements(), element => {
						return element.isSelected();
					});
					if (selected.length > 0) {
						let model = new SelectionElementModel();
						model.setModels(selected);
						selectionLayer.addModel(model);
						this.canvasWidget.forceUpdate();
					}
				}
			})
		);
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
		this.registerElementFactory(new RectangleElementFactory());
		this.registerElementFactory(new SelectionElementFactory());
		this.registerElementFactory(new GridElementFactory());
		this.registerElementFactory(new EllipseElementFactory());
		this.registerElementFactory(new PaperElementFactory());

		// install actions
		KeyInput.installActions(this.stateMachine, this.eventBus);
		MouseDownInput.installActions(this.stateMachine, this.eventBus);
		ModelElementInput.installActions(this.stateMachine, this.eventBus);
		this.eventBus.registerAction(new ZoomCanvasAction(this));
		this.eventBus.registerAction(new DeselectModelsAction(this));

		// possible states
		this.stateMachine.addState(new SelectElementsState(this));
		this.stateMachine.addState(new TranslateElementState(this));
		this.stateMachine.addState(new TranslateCanvasState(this));
		this.stateMachine.addState(new DefaultState(this));

		// default wiring
		this.installHistoryBank();
		this.installDefaultInteractivity();

		// process to set the initial state
		this.stateMachine.process();
	}

	getCanvasWidget(): CanvasWidget {
		return this.canvasWidget;
	}

	setCanvasWidget(widget: CanvasWidget) {
		this.canvasWidget = widget;
		if (widget) {
			this.historyBank.pushState(this.model.serialize());
		}
	}

	getFactory(type: string): AbstractElementFactory {
		if (!this.elementFactories[type]) {
			throw new CanvasEngineError('Cannot find Element factory with type: ' + type);
		}
		return this.elementFactories[type];
	}

	getFactoryForElement(element: BaseModel): AbstractElementFactory {
		return this.getFactory(element.getType());
	}
}
