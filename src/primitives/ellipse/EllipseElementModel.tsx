import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { Rectangle } from "../../geometry/Rectangle";
import { Point } from "../../geometry/Point";
import * as _ from "lodash";
import { Polygon } from "../../geometry/Polygon";
import { DeserializeEvent } from "../../base-models/BaseModel";
import { EllipseElementFactory } from "./EllipseElementFactory";

export class EllipseElementModel extends CanvasElementModel {
	radiusX: number;
	radiusY: number;
	center: Point;
	background: string;

	constructor() {
		super(EllipseElementFactory.NAME);
		this.radiusX = 100;
		this.radiusY = 100;
		this.center = new Point(0, 0);
		this.background = "rgb(0,192,255)";
	}

	static createPointCloud(points: Point[], radius: number = 5) {
		return _.map(points, point => {
			let model = new EllipseElementModel();
			model.radiusX = radius;
			model.radiusY = radius;
			model.center = point.clone();
			return model;
		});
	}

	static createPointCloudFrom(rectangle: Polygon, radius: number = 5): EllipseElementModel[] {
		return EllipseElementModel.createPointCloud(rectangle.getPoints().concat(rectangle.getOrigin()), radius);
	}

	getDimensions(): Rectangle {
		return new Rectangle(
			this.center.x - this.radiusX,
			this.center.y - this.radiusY,
			this.radiusX * 2,
			this.radiusY * 2
		);
	}

	deSerialize(event: DeserializeEvent): void {
		super.deSerialize(event);
		this.radiusX = event.data["radiusX"];
		this.radiusY = event.data["radiusY"];
		this.background = event.data["background"];
		this.center = new Point(event.data["centerX"], event.data["centerY"]);
	}

	serialize() {
		return {
			...super.serialize(),
			radiusX: this.radiusX,
			radiusY: this.radiusY,
			centerX: this.center.x,
			centerY: this.center.y
		};
	}

	setDimensions(dimensions: Rectangle) {}
}
