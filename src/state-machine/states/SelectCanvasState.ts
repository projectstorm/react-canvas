import { AbstractState } from "../AbstractState";
import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import * as _ from "lodash";
import { MouseDownInput } from "../input/MouseDownInput";

export class SelectCanvasState extends AbstractState {
	engine: CanvasEngine;

	static NAME = "select-canvas";

	constructor(engine: CanvasEngine) {
		super(SelectCanvasState.NAME);
		this.requireInput(MouseDownInput.NAME);
		this.engine = engine;
	}

	shouldStateActivate(machine: StateMachine): boolean {
		return super.shouldStateActivate(machine) && _.keys(machine.inputs).length === 1;
	}

	activated(machine: StateMachine) {
		let entities = this.engine.getModel().getSelectedEntities();
		_.forEach(entities, entity => {
			entity.setSelected(false);
		});
		this.engine.getCanvasWidget().forceUpdate();
	}

	deactivate(machine: StateMachine) {}

	process(machine: StateMachine) {}
}
