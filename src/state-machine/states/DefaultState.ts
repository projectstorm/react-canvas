import { AbstractState } from '../AbstractState';
import { CanvasEngine } from '../../CanvasEngine';
import { SelectElementAction } from '../../event-bus/actions/SelectElementAction';

export class DefaultState extends AbstractState {
  constructor(engine: CanvasEngine) {
    super('default-state', engine);
    this.registerAction(new SelectElementAction(engine, false));
  }
}
