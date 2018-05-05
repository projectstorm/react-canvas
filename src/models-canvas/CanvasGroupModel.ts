import { CanvasElementModel } from "./CanvasElementModel";
import { Rectangle } from "../geometry/Rectangle";

export class CanvasGroupModel extends CanvasElementModel {
	getDimensions(): Rectangle {
		return undefined;
	}

	setDimensions(dimensions: Rectangle) {}
}
