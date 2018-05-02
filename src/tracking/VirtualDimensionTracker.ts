import { DimensionTracker } from "./DimensionTracker";
import { CanvasEngine } from "../CanvasEngine";
import { Rectangle } from "../geometry/Rectangle";
import { Point } from "../geometry/Point";
import * as _ from "lodash";

export class VirtualDimensionTracker extends DimensionTracker {
	virtualDimensions: Rectangle;

	constructor() {
		super();
		this.virtualDimensions = new Rectangle();
	}

	static projectPoints(engine: CanvasEngine, points: Point[]): Point[] {
		let model = engine.getModel();
		let canDimensions = engine.getCanvasWidget().dimension.realDimensions;
		// store the virtual dimensions
		let zoomLevel = model.getZoomLevel();

		return _.map(points, point => {
			return new Point(
				(point.x - canDimensions.getTopLeft().x - model.getOffsetX()) / zoomLevel,
				(point.y - canDimensions.getTopLeft().y - model.getOffsetY()) / zoomLevel
			);
		});
	}

	recompute(engine: CanvasEngine, clientRect: ClientRect) {
		super.recompute(engine, clientRect);

		let model = engine.getModel();
		let canDimensions = engine.getCanvasWidget().dimension.realDimensions;
		// store the virtual dimensions
		let zoomLevel = model.getZoomLevel();
		this.virtualDimensions.updateDimensions(
			(clientRect.left - canDimensions.getTopLeft().x - model.getOffsetX()) / zoomLevel,
			(clientRect.top - canDimensions.getTopLeft().y - model.getOffsetY()) / zoomLevel,
			clientRect.width / zoomLevel,
			clientRect.height / zoomLevel
		);
	}
}
