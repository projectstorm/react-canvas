import { AbstractStateMachineInput } from "../AbstractStateMachineInput";
import { EventBus } from "../../event-bus/EventBus";
import { KeyDownEvent, KeyUpEvent } from "../../event-bus/events/key";
import { InlineAction } from "../../event-bus/InlineAction";
import { StateMachine } from "../StateMachine";
import { MouseDownEvent, MouseUpEvent } from "../../event-bus/events/mouse";

export class MouseDownInput extends AbstractStateMachineInput {
	mouseX: number;
	mouseY: number;

	static NAME = "mouse-down";

	constructor(event: MouseDownEvent) {
		super(MouseDownInput.NAME);
		this.mouseX = event.mouseX;
		this.mouseY = event.mouseY;
	}

	static installActions(machine: StateMachine, eventBus: EventBus) {
		eventBus.registerAction(
			new InlineAction<MouseDownEvent>(MouseDownEvent.NAME, event => {
				machine.addInput(new MouseDownInput(event));
			})
		);
		eventBus.registerAction(
			new InlineAction<MouseUpEvent>(MouseUpEvent.NAME, event => {
				machine.removeInput(MouseDownInput.NAME);
			})
		);
	}
}
