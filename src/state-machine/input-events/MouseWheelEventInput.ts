import { AbstractStateMachineEventInput } from "./AbstractStateMachineEventInput";

export class MouseWheelEventInput extends AbstractStateMachineEventInput {
	amount: number;
	mouseX: number;
	mouseY: number;

	static NAME = "mouse-wheel";

	constructor(amount: number, mouseX: number, mouseY: number) {
		super(MouseWheelEventInput.NAME);
		this.amount = amount;
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
}
