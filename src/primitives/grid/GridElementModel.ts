import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { Rectangle } from "../../geometry/Rectangle";

export class GridElementModel extends CanvasElementModel {
	sizeX: number;
	sizeY: number;
	color: string;
	thickness: number;

	constructor() {
		super("grid");
		this.sizeX = 50;
		this.sizeY = 50;
		this.color = "rgba(0,0,0,0.1)";
		this.thickness = 1;
	}

	getDimensions(): Rectangle {
		return undefined;
	}

	setDimensions(dimensions: Rectangle) {}
}
