import { Event } from "../Event";

export abstract class KeyEvent extends Event {
	key: string;

	constructor(name: string, source: any, key: string) {
		super(name, source);
		this.key = key;
	}
}

export class KeyDownEvent extends KeyEvent {
	static NAME = "key-down";

	constructor(source: any, key: string) {
		super(KeyDownEvent.NAME, source, key);
	}
}

export class KeyUpEvent extends KeyEvent {
	static NAME = "key-up";

	constructor(source: any, key: string) {
		super(KeyUpEvent.NAME, source, key);
	}
}
