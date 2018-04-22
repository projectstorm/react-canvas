import { AbstractDisplacementState } from "../AbstractDisplacementState";
import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import { Rectangle } from "../../geometry/Rectangle";
import { ModelElementInput } from "../input/ModelElementInput";
import { SelectElementAction } from "../../event-bus/actions/SelectElementAction";

export class TranslateElementState extends AbstractDisplacementState {
	initialPosition: Rectangle;
	input: ModelElementInput;

	constructor(engine: CanvasEngine) {
		super("translate-element", engine);
		this.requireInput(ModelElementInput.NAME);
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		this.input = machine.getInput(ModelElementInput.NAME) as ModelElementInput;
		this.initialPosition = this.input.element.getDimensions().clone();
	}

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
