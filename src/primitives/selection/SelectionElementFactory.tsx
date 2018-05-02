import { AbstractElementFactory } from "../../AbstractElementFactory";
import { SelectionElementModel } from "./SelectionElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import { SelectionElementWidget } from "./SelectionElementWidget";
import * as React from "react";
import { ResizeDimensionsState } from "../../state-machine/states/ResizeDimensionsState";
import { ResizeOriginDimensionsState } from "../../state-machine/states/ResizeOriginDimensionState";
import { RotateElementsState } from "../../state-machine/states/RotateElementsState";

export class SelectionElementFactory extends AbstractElementFactory<SelectionElementModel> {
	constructor() {
		super("selection");
	}

	generateModel(): SelectionElementModel {
		return new SelectionElementModel();
	}

	getCanvasStates() {
		return [
			new ResizeOriginDimensionsState(this.engine),
			new ResizeDimensionsState(this.engine),
			new RotateElementsState(this.engine)
		];
	}

	generateWidget(engine: CanvasEngine, model: SelectionElementModel): JSX.Element {
		return <SelectionElementWidget engine={engine} model={model} />;
	}
}
