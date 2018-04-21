import { AbstractStateMachineInput } from "./AbstractStateMachineInput";

export enum KeyCode {
	SHIFT = "Shift"
}

export class KeyInput extends AbstractStateMachineInput {
	key: any;

	static identifier(key: string) {
		return "key-" + name;
	}

	constructor(key: string) {
		super(KeyInput.identifier(key));
		this.key = key;
	}

	isShift(): boolean {
		return this.key === KeyCode.SHIFT;
	}
}
