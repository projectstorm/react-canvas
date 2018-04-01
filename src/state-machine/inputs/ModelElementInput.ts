import { StateMachineInput } from "../StateMachineInput";
import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";

export class ModelElementInput extends StateMachineInput {
	element: CanvasElementModel;

	static NAME = "model-element";

	constructor(element: CanvasElementModel) {
		super(ModelElementInput.NAME);
		this.element = element;
		this.fallthrough = false;
	}
}
