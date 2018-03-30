import { StateMachineInput } from "../StateMachineInput";
import { SelectionElementModel } from "../../primitives/selection/SelectionElementModel";

export enum ModelAnchorInputPosition {
	TOP,
	TOP_LEFT,
	TOP_RIGHT,
	LEFT,
	RIGHT,
	BOT,
	BOT_LEFT,
	BOT_RIGHT
}

export class ModelAnchorInput extends StateMachineInput {
	selectionModel: SelectionElementModel;
	anchor: ModelAnchorInputPosition;

	static NAME = "model-anchor";

	constructor(model: SelectionElementModel, anchor: ModelAnchorInputPosition) {
		super(ModelAnchorInput.NAME);
		this.selectionModel = model;
		this.anchor = anchor;
	}
}
