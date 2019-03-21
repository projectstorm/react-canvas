import * as _ from 'lodash';
import {AbstractElementFactory} from './base-factories/AbstractElementFactory';
import {RectangleElementFactory} from './primitives/rectangle/RectangleElementFactory';
import {CanvasModel} from './primitives-core/canvas/CanvasModel';
import {SelectionElementFactory} from './primitives/selection/SelectionElementFactory';
import {StateMachine} from './state-machine/StateMachine';
import {TranslateCanvasState} from './state-machine/states/TranslateCanvasState';
import {GridElementFactory} from './primitives/grid/GridElementFactory';
import {EllipseElementFactory} from './primitives/ellipse/EllipseElementFactory';
import {TranslateElementState} from './state-machine/states/TranslateElementState';
import {SelectElementsState} from './state-machine/states/SelectElementsState';
import {HistoryBank} from './history/HistoryBank';
import {LayerFactory} from './primitives-core/layer/LayerFactory';
import {EventBus} from './event-bus/EventBus';
import {ZoomCanvasAction} from './event-bus/actions/ZoomCanvasAction';
import {MouseDownInput} from './state-machine/input/MouseDownInput';
import {KeyInput} from './state-machine/input/KeyInput';
import {ModelElementInput} from './state-machine/input/ModelElementInput';
import {DefaultState} from './state-machine/states/DefaultState';
import {Toolkit} from '@projectstorm/react-core';
import {ModelEvent} from './event-bus/events/ModelEvent';
import {PaperElementFactory} from './primitives/paper/PaperElementFactory';
import {BaseEvent, BaseObject} from '@projectstorm/react-core';
import {BaseModel, DeserializeEvent} from './base-models/BaseModel';
import {DeselectModelsAction} from './event-bus/actions/DeselectModelsAction';
import {CanvasFactory} from "./primitives-core/canvas/CanvasFactory";

export class CanvasEngineError extends Error {
}

export interface CanvasEngineListener<T> {
  modelChanged?: (event: BaseEvent & { model: T; oldModel: T }) => any;
  repaint?: () => any;
}

export class CanvasEngine<T extends CanvasModel = CanvasModel> extends BaseObject<CanvasEngineListener<T>> {
  protected elementFactories: { [type: string]: AbstractElementFactory };
  protected model: T;
  protected stateMachine: StateMachine;
  protected historyBank: HistoryBank;
  protected eventBus: EventBus;
  protected debugMode: boolean;

  private modelListener: string;

  constructor() {
    super();
    this.elementFactories = {};
    this.model = null;
    this.stateMachine = new StateMachine();
    this.historyBank = new HistoryBank();
    this.eventBus = new EventBus();
    this.modelListener = null;
    this.debugMode = false;

    if (Toolkit.TESTING) {
      Toolkit.TESTING_UID = 0;
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
        listener.modelChanged({...event, model: model, oldModel: oldModel});
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
    this.repaint();
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
    this.iterateListeners('repaint', (listener) => {
      if (listener.repaint) {
        listener.repaint();
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

    // core factories
    this.registerElementFactory(new LayerFactory());
    this.registerElementFactory(new CanvasFactory());

    // element factories
    this.registerElementFactory(new RectangleElementFactory());
    this.registerElementFactory(new SelectionElementFactory());
    this.registerElementFactory(new GridElementFactory());
    this.registerElementFactory(new EllipseElementFactory());
    this.registerElementFactory(new PaperElementFactory());

    // install actions
    KeyInput.installActions(this.stateMachine, this.eventBus);
    MouseDownInput.installActions(this.stateMachine, this.eventBus);
    ModelElementInput.installActions(this.stateMachine, this.eventBus);

    // standard actions
    this.eventBus.registerAction(new ZoomCanvasAction(this));
    this.eventBus.registerAction(new DeselectModelsAction(this));

    // possible states
    this.stateMachine.addState(new SelectElementsState(this));
    this.stateMachine.addState(new TranslateElementState(this));
    this.stateMachine.addState(new TranslateCanvasState(this));
    this.stateMachine.addState(new DefaultState(this));

    // default wiring
    this.installHistoryBank();

    // process to set the initial state
    this.stateMachine.process();
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
