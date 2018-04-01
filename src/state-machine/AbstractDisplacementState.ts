import { AbstractState } from "./AbstractState";
import { MouseInput, MouseInputType } from "./inputs/MouseInput";
import { StateMachine } from "./StateMachine";
import { CanvasEngine } from "../CanvasEngine";

export abstract class AbstractDisplacementState extends AbstractState {
	initialMouse: MouseInput;
	engine: CanvasEngine;

	constructor(name: string) {
		super(name);
		this.whitelist(MouseInputType.DOWN);
		this.whitelist(MouseInputType.MOVE);
	}

	abstract processDisplacement(displacementX, displacementY);

	activated(machine: StateMachine) {
		this.initialMouse = machine.getInput(MouseInputType.DOWN) as MouseInput;
	}

	process(machine: StateMachine) {
		let input = machine.getInput(MouseInputType.MOVE) as MouseInput;
		this.processDisplacement(input.mouseX - this.initialMouse.mouseX, input.mouseY - this.initialMouse.mouseY);
	}
}
