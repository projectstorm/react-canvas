import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { AbstractStateMachineInput } from "./AbstractStateMachineInput";

export class ModelElementInput extends AbstractStateMachineInput {
	element: CanvasElementModel;

	static NAME = "model-element";

	constructor(element: CanvasElementModel) {
		super(ModelElementInput.NAME);
		this.element = element;
	}
}
