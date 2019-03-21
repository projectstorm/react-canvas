import { CanvasEngine } from './CanvasEngine';
import { AbstractState } from './state-machine/AbstractState';
import { BaseModel } from './base-models/BaseModel';

export abstract class AbstractElementFactory<T extends BaseModel = BaseModel> {
  public type: string;
  protected directiveProcessors;
  protected engine: CanvasEngine;

  constructor(type: string) {
    this.type = type;
    this.directiveProcessors = [];
  }

  setEngine(engine: CanvasEngine) {
    this.engine = engine;
  }

  getCanvasStates(): AbstractState[] {
    return [];
  }

  abstract generateModel(): T;

  abstract generateWidget(engine: CanvasEngine, model: T): JSX.Element;
}
