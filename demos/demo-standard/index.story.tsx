import { CanvasWidget } from "../../src/widgets/CanvasWidget";
import * as React from "react";
import { CanvasEngine } from "../../src/CanvasEngine";
import { CanvasModel } from "../../src/models-canvas/CanvasModel";
import { CanvasLayerModel } from "../../src/models-canvas/CanvasLayerModel";
import { SquareElementModel } from "../../src/primitives/square/SquareElementModel";

import { storiesOf } from "@storybook/react";
import { button } from "@storybook/addon-knobs";
import { GridElementModel } from "../../src/primitives/grid/GridElementModel";
import { PaperElementModel } from "../../src/primitives/paper/PaperElementModel";

storiesOf("Simple Usage", module).add("Full example", () => {
	//setup canvas engine
	let engine = new CanvasEngine();
	engine.installDefaults();

	let model = new CanvasModel();
	model.setOffset(100, 100);
	model.setZoomLevel(1);
	engine.setModel(model);

	// grid layer
	let layer2 = new CanvasLayerModel();
	layer2.setSVG(true);
	layer2.setTransformable(false);
	model.addLayer(layer2);

	let gridModel = new GridElementModel();
	layer2.addEntity(gridModel);

	let gridModel2 = new GridElementModel();
	gridModel2.sizeX = 200;
	gridModel2.sizeY = 200;
	gridModel2.color = "cyan";
	gridModel2.thickness = 2;
	layer2.addEntity(gridModel2);

	// paper layer
	let paperLayer = new CanvasLayerModel();
	paperLayer.setSVG(false);
	paperLayer.setTransformable(true);
	let paper = new PaperElementModel();
	paperLayer.addEntity(paper);
	model.addLayer(paperLayer);

	// add layer
	let layer = new CanvasLayerModel();
	layer.setSVG(true);
	layer.setTransformable(true);
	model.addLayer(layer);

	// squares
	let squareModel = new SquareElementModel();
	squareModel.dimensions.updateDimensions(-100, -100, 100, 100);

	let squareModel2 = new SquareElementModel();
	squareModel2.dimensions.updateDimensions(300, 300, 50, 70);

	let squareModel3 = new SquareElementModel();
	squareModel3.dimensions.updateDimensions(420, 420, 50, 70);

	layer.addEntities([squareModel, squareModel2, squareModel3]);

	button("Fit Width", () => {
		engine.getCanvasWidget().zoomToFit(15);
	});

	button("Undo", () => {
		engine.getHistoryBank().goBackward();
	});

	button("Redo", () => {
		engine.getHistoryBank().goForward();
	});

	return <CanvasWidget engine={engine} />;
});
