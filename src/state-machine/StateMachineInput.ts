export class StateMachineInput {
	name: string;
	ejected: boolean;
	locked: boolean;

	constructor(name: string) {
		this.name = name;
		this.ejected = false;
		this.locked = false;
	}

	lock() {
		this.locked = true;
	}

	eject() {
		this.ejected = true;
	}
}
