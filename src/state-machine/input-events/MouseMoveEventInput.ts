import {AbstractStateMachineEventInput} from "./AbstractStateMachineEventInput";

export class MouseMoveEventInput extends AbstractStateMachineEventInput{
	mouseX: number;
	mouseY: number;

	static NAME = 'mouse-move';

	constructor(event: MouseEvent){
		super(MouseMoveEventInput.NAME);
		this.mouseX = event.clientX;
		this.mouseY = event.clientY;
	}
}
