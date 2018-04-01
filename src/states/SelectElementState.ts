import { AbstractState } from "../state-machine/AbstractState";
import { StateMachine } from "../state-machine/StateMachine";
import { MouseInputType } from "../state-machine/inputs/MouseInput";
import { ModelElementInput } from "../state-machine/inputs/ModelElementInput";
import { CanvasEngine } from "../CanvasEngine";
import * as _ from "lodash";

export class SelectElementState extends AbstractState {
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super("select-element");
		this.whitelist(MouseInputType.DOWN);
		this.whitelist(ModelElementInput.NAME);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		_.forEach(this.engine.getModel().getSelectedEntities(), entity => {
			entity.setSelected(false);
		});

		let input = machine.getInput(ModelElementInput.NAME) as ModelElementInput;
		input.element.setSelected(true);
		this.engine.getCanvasWidget().forceUpdate();
	}

	deactivate(machine: StateMachine) {}

	process(machine: StateMachine) {}
}
