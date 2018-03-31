import { StateMachine } from "../state-machine/StateMachine";
import { CanvasEngine } from "../CanvasEngine";
import { MouseInputType } from "../state-machine/inputs/MouseInput";
import { AbstractDisplacementState } from "../state-machine/AbstractDisplacementState";

export class TranslateCanvasState extends AbstractDisplacementState {
	initialOffsetX: number;
	initialOffsetY: number;
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super("translate-canvas", [MouseInputType.MOVE, MouseInputType.DOWN]);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		this.initialOffsetX = this.engine.getModel().getOffsetX();
		this.initialOffsetY = this.engine.getModel().getOffsetY();
	}

	deactivate(machine: StateMachine) {}

	processDisplacement(displacementX, displacementY) {
		this.engine.getModel().setOffset(this.initialOffsetX + displacementX, this.initialOffsetY + displacementY);
		this.engine.getCanvasWidget().forceUpdate();
	}
}
