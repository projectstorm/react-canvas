import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import { AbstractDisplacementState } from "../AbstractDisplacementState";
import { SelectCanvasAction } from "../../event-bus/actions/SelectCanvasAction";

export class TranslateCanvasState extends AbstractDisplacementState {
	initialOffsetX: number;
	initialOffsetY: number;

	constructor(engine: CanvasEngine) {
		super("translate-canvas", engine);
		this.registerAction(new SelectCanvasAction(engine));
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		this.initialOffsetX = this.engine.getModel().getOffsetX();
		this.initialOffsetY = this.engine.getModel().getOffsetY();
	}

	processDisplacement(displacementX, displacementY) {
		this.engine.getModel().setOffset(this.initialOffsetX + displacementX, this.initialOffsetY + displacementY);
		this.engine.getCanvasWidget().forceUpdate();
	}
}
