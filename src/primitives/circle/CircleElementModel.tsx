import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { Rectangle } from "../../geometry/Rectangle";
import { Point } from "../../geometry/Point";
import * as _ from "lodash";
import { Polygon } from "../../geometry/Polygon";

export class CircleElementModel extends CanvasElementModel {
	radiusX: number;
	radiusY: number;
	center: Point;
	background: string;

	constructor() {
		super("circle");
		this.radiusX = 100;
		this.radiusY = 100;
		this.center = new Point(0, 0);
		this.background = "rgb(0,192,255)";
	}

	getDimensions(): Rectangle {
		return new Rectangle(
			this.center.x - this.radiusX,
			this.center.y - this.radiusY,
			this.radiusX * 2,
			this.radiusY * 2
		);
	}

	static createPointCloudFrom(rectangle: Polygon, radius: number = 5): CircleElementModel[] {
		return _.map(rectangle.getPoints(), point => {
			let model = new CircleElementModel();
			model.radiusX = radius;
			model.radiusY = radius;
			model.center = point.clone();
			return model;
		});
	}

	setDimensions(dimensions: Rectangle) {}
}
