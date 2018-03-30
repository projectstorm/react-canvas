import { AbstractElementFactory } from "../../AbstractElementFactory";
import { SquareElementModel } from "./SquareElementModel";
import { SquareElementWidget } from "./SquareElementWidget";
import * as React from "react";
import { CanvasEngine } from "../../CanvasEngine";

export class SquareElementFactory extends AbstractElementFactory<SquareElementModel> {
	constructor() {
		super("square");
	}

	generateModel(): SquareElementModel {
		return new SquareElementModel();
	}

	generateWidget(engine: CanvasEngine, model: SquareElementModel): JSX.Element {
		return <SquareElementWidget engine={engine} model={model} />;
	}
}
