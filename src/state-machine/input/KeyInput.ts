import { AbstractStateMachineInput } from "../AbstractStateMachineInput";
import { EventBus } from "../../event-bus/EventBus";
import { InlineAction } from "../../event-bus/InlineAction";
import { KeyDownEvent, KeyUpEvent } from "../../event-bus/events/key";
import { StateMachine } from "../StateMachine";

export enum KeyCode {
	SHIFT = "Shift",
	CONTROL = "Control"
}

export class KeyInput extends AbstractStateMachineInput {
	key: any;

	static identifier(key: string) {
		return "key-" + key;
	}

	constructor(key: string) {
		super(KeyInput.identifier(key));
		this.key = key;
	}

	static installActions(machine: StateMachine, eventBus: EventBus) {
		eventBus.registerAction(
			new InlineAction<KeyDownEvent>(KeyDownEvent.NAME, event => {
				machine.addInput(new KeyInput(event.key));
			})
		);
		eventBus.registerAction(
			new InlineAction<KeyUpEvent>(KeyUpEvent.NAME, event => {
				machine.removeInput(KeyInput.identifier(event.key));
			})
		);
	}

	isShift(): boolean {
		return this.key === KeyCode.SHIFT;
	}
}
