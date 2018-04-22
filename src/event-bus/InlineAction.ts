import { Action } from "./Action";
import { Event } from "./Event";

export class InlineAction<T extends Event> extends Action<T> {
	cb: (event: T) => any;

	constructor(name: string, callback: (event: T) => any) {
		super(name);
		this.cb = callback;
	}

	doAction(event: T) {
		return this.cb(event);
	}
}
