import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import { AbstractDisplacementState } from "../AbstractDisplacementState";
import { MouseDownInput } from "../input/MouseDownInput";
import { MouseMoveEventInput } from "../input-events/MouseMoveEventInput";

export class TranslateCanvasState extends AbstractDisplacementState {
	initialOffsetX: number;
	initialOffsetY: number;
	engine: CanvasEngine;

	static NAME = "translate-canvas";

	constructor(engine: CanvasEngine) {
		super(TranslateCanvasState.NAME);
		this.requireInput(MouseDownInput.NAME);
		this.requireInput(MouseMoveEventInput.NAME);
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
