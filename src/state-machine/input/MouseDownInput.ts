import { AbstractStateMachineInput } from '../AbstractStateMachineInput';
import { EventBus } from '../../event-bus/EventBus';
import { InlineAction } from '../../event-bus/InlineAction';
import { StateMachine } from '../StateMachine';
import { MouseDownEvent, MouseUpEvent } from '../../event-bus/events/mouse';

export class MouseDownInput extends AbstractStateMachineInput {
  mouseX: number;
  mouseY: number;
  originalEvent: MouseDownEvent;

  static NAME = 'mouse-down';

  constructor(event: MouseDownEvent) {
    super(MouseDownInput.NAME);
    this.mouseX = event.mouseX;
    this.mouseY = event.mouseY;
    this.originalEvent = event;
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
