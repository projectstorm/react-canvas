import { AbstractElementFactory } from "../../AbstractElementFactory";
import { GridElementModel } from "./GridElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import { GridElementWidget } from "./GridElementWidget";
import * as React from "react";

export class GridElementFactory extends AbstractElementFactory<GridElementModel> {
	constructor() {
		super("grid");
	}

	generateModel(): GridElementModel {
		return undefined;
	}

	generateWidget(engine: CanvasEngine, model: GridElementModel): JSX.Element {
		return <GridElementWidget engine={engine} model={model} />;
	}
}
