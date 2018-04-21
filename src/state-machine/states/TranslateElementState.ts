import { AbstractDisplacementState } from "../AbstractDisplacementState";
import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import { Rectangle } from "../../geometry/Rectangle";
import { ModelElementInput } from "../input/ModelElementInput";

export class TranslateElementState extends AbstractDisplacementState {
	engine: CanvasEngine;
	initialPosition: Rectangle;
	input: ModelElementInput;

	static NAME = "translate-element";

	constructor(engine: CanvasEngine) {
		super(TranslateElementState.NAME);
		this.requireInput(ModelElementInput.NAME);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		this.input = machine.getInput(ModelElementInput.NAME) as ModelElementInput;
		this.initialPosition = this.input.element.getDimensions().clone();
	}

	deactivate(machine: StateMachine) {}

	processDisplacement(displacementX, displacementY) {
		const dim = this.initialPosition.clone();
		dim.updateDimensions(
			this.initialPosition.getTopLeft().x + displacementX / this.engine.getModel().getZoomLevel(),
			this.initialPosition.getTopLeft().y + displacementY / this.engine.getModel().getZoomLevel(),
			dim.getWidth(),
			dim.getHeight()
		);
		this.input.element.setDimensions(dim);
		this.engine.getCanvasWidget().forceUpdate();
	}
}
