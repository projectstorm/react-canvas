import { AbstractElementFactory } from "../../AbstractElementFactory";
import { PaperElementModel } from "./PaperElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import { PaperElementWidget } from "./PaperElementWidget";
import * as React from "react";

export class PaperElementFactory extends AbstractElementFactory<PaperElementModel> {
	constructor() {
		super("paper");
	}

	generateModel(): PaperElementModel {
		return new PaperElementModel();
	}

	generateWidget(engine: CanvasEngine, model: PaperElementModel): JSX.Element {
		return <PaperElementWidget model={model} />;
	}
}
