import { CanvasWidget } from "../../src/widgets/CanvasWidget";
import * as React from "react";
import { CanvasEngine } from "../../src/CanvasEngine";
import { CanvasModel } from "../../src/models-canvas/CanvasModel";
import { CanvasLayerModel } from "../../src/models-canvas/CanvasLayerModel";
import { SquareElementModel } from "../../src/primitives/square/SquareElementModel";

import { storiesOf } from "@storybook/react";
import { button } from "@storybook/addon-knobs";

storiesOf("Simple Usage", module).add("Full example", () => {
	//setup canvas engine
	let engine = new CanvasEngine();
	engine.installDefaults();

	let model = new CanvasModel();
	model.setOffset(300, 300);
	engine.setModel(model);

	// add layer
	let layer = new CanvasLayerModel();
	layer.svg = true;
	layer.transform = true;
	model.addLayer(layer);

	let squareModel = new SquareElementModel();
	squareModel.dimensions.updateDimensions(-100, -100, 100, 100);
	squareModel.selected = true;
	layer.addElement(squareModel);

	let squareModel2 = new SquareElementModel();
	squareModel2.dimensions.updateDimensions(300, 300, 50, 70);
	squareModel2.selected = true;
	layer.addElement(squareModel2);

	let squareModel3 = new SquareElementModel();
	squareModel3.dimensions.updateDimensions(420, 420, 50, 70);
	squareModel3.selected = true;
	layer.addElement(squareModel3);

	button("Fit Width", () => {
		engine.getCanvasWidget().zoomToFit(15);
	});

	return <CanvasWidget engine={engine} />;
});
