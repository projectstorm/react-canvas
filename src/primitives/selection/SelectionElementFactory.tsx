import { AbstractElementFactory } from "../../AbstractElementFactory";
import { SelectionElementModel } from "./SelectionElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import { SelectionElementWidget } from "./SelectionElementWidget";
import * as React from "react";
import { ResizeDimensionsState } from "../../states/ResizeDimensionsState";

export class SelectionElementFactory extends AbstractElementFactory<SelectionElementModel> {
	constructor() {
		super("selection");
	}

	generateModel(): SelectionElementModel {
		return undefined;
	}

	getCanvasStates() {
		return [new ResizeDimensionsState(this.engine)];
	}

	generateWidget(engine: CanvasEngine, model: SelectionElementModel): JSX.Element {
		return <SelectionElementWidget engine={engine} model={model} />;
	}
}
