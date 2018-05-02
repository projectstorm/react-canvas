import { Action } from "../Action";
import { MouseDownEvent } from "../events/mouse";
import * as _ from "lodash";
import { CanvasEngine } from "../../CanvasEngine";

export class SelectCanvasAction extends Action<MouseDownEvent> {
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super(MouseDownEvent.NAME);
		this.engine = engine;
	}

	doAction(event: MouseDownEvent) {
		event.stopPropagation();
		let entities = this.engine.getModel().getSelectedEntities();
		_.forEach(entities, entity => {
			entity.setSelected(false);
		});
		this.engine.repaint();
	}
}
