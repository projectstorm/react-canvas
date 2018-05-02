import { SelectionElementModel } from "../../primitives/selection/SelectionElementModel";
import { AbstractStateMachineInput } from "../AbstractStateMachineInput";

export class ModelRotateInput extends AbstractStateMachineInput {
	selectionModel: SelectionElementModel;

	static NAME = "model-rotate";

	constructor(model: SelectionElementModel) {
		super(ModelRotateInput.NAME);
		this.selectionModel = model;
	}
}
