import { AbstractState } from "../state-machine/AbstractState";
import { StateMachine } from "../state-machine/StateMachine";
import { CanvasEngine } from "../CanvasEngine";
import { MouseInput, MouseInputType } from "../state-machine/inputs/MouseInput";

export class TranslateCanvasState extends AbstractState {
	initialMouse: MouseInput;
	initialOffsetX: number;
	initialOffsetY: number;
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super("translate-canvas", [MouseInputType.MOVE, MouseInputType.DOWN]);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		this.initialMouse = machine.getInput(MouseInputType.DOWN) as MouseInput;
		this.initialOffsetX = this.engine.getModel().getOffsetX();
		this.initialOffsetY = this.engine.getModel().getOffsetY();
	}

	deactivate(machine: StateMachine) {}

	process(machine: StateMachine) {
		let input = machine.getInput(MouseInputType.MOVE) as MouseInput;
		this.engine
			.getModel()
			.setOffset(
				this.initialOffsetX + (input.mouseX - this.initialMouse.mouseX),
				this.initialOffsetY + (input.mouseY - this.initialMouse.mouseY)
			);
		this.engine.getCanvasWidget().forceUpdate();
	}
}
