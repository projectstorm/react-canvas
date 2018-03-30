import { StateMachineInput } from "../StateMachineInput";

export class MouseWheelInput extends StateMachineInput {
	amount: number;
	mouseX: number;
	mouseY: number;

	static NAME = "mouse-wheel";

	constructor(amount: number, mouseX: number, mouseY: number) {
		super(MouseWheelInput.NAME);
		this.amount = amount;
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
}
