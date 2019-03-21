import { AbstractState } from './AbstractState';
import { StateMachine } from './StateMachine';
import { CanvasEngine } from '../CanvasEngine';
import { MouseDownInput } from './input/MouseDownInput';
import { InlineAction } from '../event-bus/InlineAction';
import { MouseMoveEvent } from '../event-bus/events/mouse';

export abstract class AbstractDisplacementState extends AbstractState {
	initialMouse: MouseDownInput;

	constructor(name: string, engine: CanvasEngine) {
		super(name, engine);
		this.requireInput(MouseDownInput.NAME);
		this.registerAction(
			new InlineAction<MouseMoveEvent>(MouseMoveEvent.NAME, event => {
				if (this.initialMouse) {
					this.processDisplacement(event.mouseX - this.initialMouse.mouseX, event.mouseY - this.initialMouse.mouseY);
				}
			})
		);
	}

	abstract processDisplacement(displacementX, displacementY);

	activated(machine: StateMachine) {
		super.activated(machine);
		this.initialMouse = machine.getInput(MouseDownInput.NAME) as MouseDownInput;
	}

	deactivated(machine: StateMachine) {
		super.deactivated(machine);
		this.initialMouse = null;
	}
}
