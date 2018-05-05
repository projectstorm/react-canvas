import { DimensionTracker } from "./DimensionTracker";
import { CanvasEngine } from "../CanvasEngine";
import { Rectangle } from "../geometry/Rectangle";

export class VirtualDimensionTracker extends DimensionTracker {
	virtualDimensions: Rectangle;

	constructor() {
		super();
		this.virtualDimensions = new Rectangle();
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
