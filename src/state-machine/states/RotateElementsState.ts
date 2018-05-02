import { AbstractState } from "../AbstractState";
import { CanvasEngine } from "../../CanvasEngine";
import { InlineAction } from "../../event-bus/InlineAction";
import { StateMachine } from "../StateMachine";
import { MouseDownInput } from "../input/MouseDownInput";
import { MouseMoveEvent } from "../../event-bus/events/mouse";
import { ModelRotateInput } from "../input/ModelRotateInput";
import { Point } from "../../geometry/Point";
import { VirtualDimensionTracker } from "../../tracking/VirtualDimensionTracker";

export class RotateElementsState extends AbstractState {
	initialMouse: MouseDownInput;
	modelRotateInput: ModelRotateInput;
	initialOrigin: Point;

	constructor(engine: CanvasEngine) {
		super("rotate-elements", engine);
		this.requireInput(ModelRotateInput.NAME);
		this.requireInput(MouseDownInput.NAME);
		this.registerAction(
			new InlineAction<MouseMoveEvent>(MouseMoveEvent.NAME, event => {
				if (this.initialMouse) {
					let degrees =
						Math.atan2(
							event.getCanvasCoordinates(this.engine).x -
								this.initialMouse.originalEvent.getCanvasCoordinates(this.engine).x,
							this.initialOrigin.y - event.getCanvasCoordinates(this.engine).y
						) *
						180 /
						Math.PI;
					console.log(degrees);
				}
			})
		);
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		this.initialMouse = machine.getInput(MouseDownInput.NAME) as MouseDownInput;
		this.modelRotateInput = machine.getInput(ModelRotateInput.NAME) as ModelRotateInput;
		this.initialOrigin = VirtualDimensionTracker.projectPoints(this.engine, [
			this.modelRotateInput.selectionModel
				.getDimensions()
				.getOrigin()
				.clone()
		])[0];
	}

	deactivated(machine: StateMachine) {
		super.deactivated(machine);
		this.initialMouse = null;
		this.modelRotateInput = null;
	}
}
