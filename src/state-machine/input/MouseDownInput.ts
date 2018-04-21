import {AbstractStateMachineInput} from "./AbstractStateMachineInput";

export class MouseDownInput extends AbstractStateMachineInput{
	mouseX: number;
	mouseY: number;

	static NAME = 'mouse-down';

	constructor(event: MouseEvent);
	constructor(clientX: number, clientY: number);

	constructor(event: MouseEvent|number, clientY?:number){
		super(MouseDownInput.NAME);
		if(event instanceof MouseEvent){
			this.mouseX = event.clientX;
			this.mouseY = event.clientY;
		}else{
			this.mouseX = event;
			this.mouseY = clientY;
		}
	}
}
