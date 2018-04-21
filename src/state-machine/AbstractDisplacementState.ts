import { AbstractState } from "./AbstractState";
import { StateMachine } from "./StateMachine";
import { CanvasEngine } from "../CanvasEngine";
import {MouseDownInput} from "./input/MouseDownInput";
import {MouseMoveEventInput} from "./input-events/MouseMoveEventInput";

export abstract class AbstractDisplacementState extends AbstractState {
	initialMouse: MouseDownInput;
	engine: CanvasEngine;

	constructor(name: string) {
		super(name);
		this.requireInput(MouseDownInput.NAME);
		this.requireInput(MouseMoveEventInput.NAME);
	}

	abstract processDisplacement(displacementX, displacementY);

	activated(machine: StateMachine) {
		this.initialMouse = machine.getInput(MouseDownInput.NAME) as MouseDownInput;
	}

	process(machine: StateMachine) {
		let input = machine.getInput(MouseMoveEventInput.NAME) as MouseMoveEventInput;
		this.processDisplacement(input.mouseX - this.initialMouse.mouseX, input.mouseY - this.initialMouse.mouseY);
	}
}
