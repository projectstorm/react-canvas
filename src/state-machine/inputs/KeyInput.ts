import { StateMachineInput } from "../StateMachineInput";

export enum KeyCode {
	SHIFT = "Shift"
}

export class KeyInput extends StateMachineInput {
	key: any;

	static identifier(key: string) {
		return "key-" + name;
	}

	constructor(key: string) {
		super(KeyInput.identifier(key));
		this.key = key;
		this.fallthrough = false;
	}

	isShift(): boolean {
		return this.key === KeyCode.SHIFT;
	}
}
