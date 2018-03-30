import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import * as _ from "lodash";
import { Rectangle } from "../../geometry/Rectangle";

export class SelectionElementModel extends CanvasElementModel {
	models: CanvasElementModel[];

	constructor() {
		super("selection");
		this.models = [];
	}

	setModels(models: CanvasElementModel[]) {
		this.models = models;
	}

	getModels(): CanvasElementModel[] {
		return this.models;
	}

	getDimensions(): Rectangle {
		return Rectangle.boundingBoxFromPolygons(
			_.map(this.models, model => {
				return model.getDimensions();
			})
		);
	}

	setDimensions(dimensions: Rectangle) {}
}
