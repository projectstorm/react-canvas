import { StateMachineInput } from "../StateMachineInput";

export enum MouseInputType {
	UP = "up",
	DOWN = "down",
	MOVE = "move"
}

export class MouseInput extends StateMachineInput {
	mouseX: number;
	mouseY: number;

	constructor(type: MouseInputType, mouseX: number, mouseY: number) {
		super(type);
		this.mouseX = mouseX;
		this.mouseY = mouseY;
		if (type === MouseInputType.DOWN) {
			this.fallthrough = false;
		}
	}
}
