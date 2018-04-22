import { Event } from "../Event";

export abstract class MouseEvent extends Event {
	mouseX: number;
	mouseY: number;

	constructor(name: string, source: any, mouseX: number, mouseY: number) {
		super(name, source);
		this.mouseX = mouseX;
		this.mouseY = mouseY;
	}
}

export class MouseDownEvent extends MouseEvent {
	static NAME = "mouse-down";

	constructor(source: any, mouseX: number, mouseY: number) {
		super(MouseDownEvent.NAME, source, mouseX, mouseY);
	}
}

export class MouseUpEvent extends MouseEvent {
	static NAME = "mouse-up";

	constructor(source: any, mouseX: number, mouseY: number) {
		super(MouseUpEvent.NAME, source, mouseX, mouseY);
	}
}

export class MouseMoveEvent extends MouseEvent {
	static NAME = "mouse-move";

	constructor(source: any, mouseX: number, mouseY: number) {
		super(MouseMoveEvent.NAME, source, mouseX, mouseY);
	}
}

export class MouseWheelEvent extends MouseEvent {
	amount: number;

	static NAME = "mouse-wheel";

	constructor(source: any, mouseX: number, mouseY: number, amount: number) {
		super(MouseWheelEvent.NAME, source, mouseX, mouseY);
		this.amount = amount;
	}
}
