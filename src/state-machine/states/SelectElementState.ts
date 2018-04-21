import { AbstractState } from "../AbstractState";
import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import * as _ from "lodash";
import {MouseDownInput} from "../input/MouseDownInput";
import {ModelElementInput} from "../input/ModelElementInput";

export class SelectElementState extends AbstractState {
	engine: CanvasEngine;

	static NAME = "select-element";

	constructor(engine: CanvasEngine) {
		super(SelectElementState.NAME);
		this.requireInput(MouseDownInput.NAME);
		this.requireInput(ModelElementInput.NAME);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		let input = machine.getInput(ModelElementInput.NAME) as ModelElementInput;

		if(!input.element.selected){
			_.forEach(this.engine.getModel().getSelectedEntities(), entity => {
				entity.setSelected(false);
			});
		}

		input.element.setSelected(true);
		this.engine.getCanvasWidget().forceUpdate();
	}

	deactivate(machine: StateMachine) {}

	process(machine: StateMachine) {}
}
