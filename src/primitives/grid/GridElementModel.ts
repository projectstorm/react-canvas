import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { Rectangle } from "../../geometry/Rectangle";

export class GridElementModel extends CanvasElementModel {
	sizeX: number;

	constructor() {
		super("grid");
		this.sizeX = 50;
	}

	getDimensions(): Rectangle {
		return undefined;
	}

	setDimensions(dimensions: Rectangle) {}
}
