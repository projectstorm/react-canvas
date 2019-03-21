import { Action } from '../Action';
import { KeyDownEvent } from '../events/key';
import { CanvasEngine } from '../../CanvasEngine';
import * as _ from 'lodash';

export class DeselectModelsAction extends Action<KeyDownEvent> {
  engine: CanvasEngine;

  constructor(engine: CanvasEngine) {
    super(KeyDownEvent.NAME);
    this.engine = engine;
  }

  doAction(event: KeyDownEvent) {
    if (event.key === 'Escape') {
      let entities = this.engine.getModel().getSelectedEntities();
      _.forEach(entities, entity => {
        entity.setSelected(false);
      });
      this.engine.repaint();
    }
  }
}
