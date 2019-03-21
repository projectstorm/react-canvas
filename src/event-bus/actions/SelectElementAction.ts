import { Action } from '../Action';
import { PressElementEvent } from '../events/elements';
import * as _ from 'lodash';
import { CanvasEngine } from '../../CanvasEngine';

export class SelectElementAction extends Action<PressElementEvent> {
	engine: CanvasEngine;
	selectMultiple: boolean;

	constructor(engine: CanvasEngine, selectMultiple: boolean = false) {
		super(PressElementEvent.NAME);
		this.engine = engine;
		this.selectMultiple = selectMultiple;
	}

	doAction(event: PressElementEvent) {
		event.stopPropagation();
		if (!event.element.isSelected()) {
			if (!this.selectMultiple) {
				_.forEach(this.engine.getModel().getSelectedEntities(), entity => {
					entity.setSelected(false);
				});
			}
			event.element.setSelected(true);
			this.engine.repaint();
		}
	}
}
