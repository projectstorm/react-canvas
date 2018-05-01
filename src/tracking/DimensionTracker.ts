import { CanvasEngine } from "../CanvasEngine";
import { Rectangle } from "../geometry/Rectangle";
import { BaseEvent, BaseListener, BaseObject } from "../models/BaseObject";

export interface DimensionTrackerListener extends BaseListener<DimensionTracker> {
	updated(event: BaseEvent);
}

export class DimensionTracker extends BaseObject<DimensionTrackerListener> {
	realDimensions: Rectangle;
	enableTracking: boolean;

	constructor() {
		super();
		this.enableTracking = true;
		this.realDimensions = new Rectangle();
	}

	recompute(canvasEngine: CanvasEngine, clientRect: ClientRect) {
		this.realDimensions.updateDimensions(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
	}

	updateDimensions(canvasEngine: CanvasEngine, ClientRect: ClientRect) {
		if (!this.enableTracking) {
			return false;
		}

		// store the real dimensions
		this.recompute(canvasEngine, ClientRect);

		// fire the update event
		this.iterateListeners("dimensions updated", (listener, event) => {
			if (listener.updated) {
				listener.updated(event);
			}
		});
	}
}
