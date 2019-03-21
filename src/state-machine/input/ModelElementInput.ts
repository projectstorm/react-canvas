import { CanvasElementModel } from '../../models-canvas/CanvasElementModel';
import { AbstractStateMachineInput } from '../AbstractStateMachineInput';
import { EventBus } from '../../event-bus/EventBus';
import { InlineAction } from '../../event-bus/InlineAction';
import { StateMachine } from '../StateMachine';
import { PressElementEvent, UnPressElementEvent } from '../../event-bus/events/elements';

export class ModelElementInput extends AbstractStateMachineInput {
	element: CanvasElementModel;

	static NAME = 'model-element';

	constructor(element: CanvasElementModel) {
		super(ModelElementInput.NAME);
		this.element = element;
	}

	static installActions(machine: StateMachine, eventBus: EventBus) {
		eventBus.registerAction(
			new InlineAction<PressElementEvent>(PressElementEvent.NAME, event => {
				machine.addInput(new ModelElementInput(event.element));
			})
		);
		eventBus.registerAction(
			new InlineAction<UnPressElementEvent>(UnPressElementEvent.NAME, event => {
				machine.removeInput(ModelElementInput.NAME);
			})
		);
	}
}
