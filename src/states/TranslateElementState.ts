import { AbstractDisplacementState } from "../state-machine/AbstractDisplacementState";
import { StateMachine } from "../state-machine/StateMachine";
import { CanvasEngine } from "../CanvasEngine";
import { Point } from "../geometry/Point";
import { ModelElementInput } from "../state-machine/inputs/ModelElementInput";
import { Rectangle } from "../geometry/Rectangle";

export class TranslateElementState extends AbstractDisplacementState {
	engine: CanvasEngine;
	initialPosition: Rectangle;
	input: ModelElementInput;

	constructor(engine: CanvasEngine) {
		super("translate-element");
		this.whitelist(ModelElementInput.NAME);
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
