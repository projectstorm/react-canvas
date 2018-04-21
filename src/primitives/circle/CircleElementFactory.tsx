import { AbstractElementFactory } from "../../AbstractElementFactory";
import { CircleElementModel } from "./CircleElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import { CircleElementWidget } from "./CircleElementWidget";
import * as React from "react";

export class CircleElementFactory extends AbstractElementFactory<CircleElementModel> {
	constructor() {
		super("circle");
	}

	generateModel(): CircleElementModel {
		return new CircleElementModel();
	}

	generateWidget(engine: CanvasEngine, model: CircleElementModel): JSX.Element {
		return <CircleElementWidget model={model} />;
	}
}
