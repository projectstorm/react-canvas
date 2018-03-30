import { BaseEvent, BaseListener, BaseModel } from "../models/BaseModel";
import { CanvasEngine } from "../CanvasEngine";
import { Rectangle } from "../geometry/Rectangle";

export interface DimensionTrackerListener extends BaseListener<DimensionTracker> {
	updated(event: BaseEvent);
}

export class DimensionTracker extends BaseModel<null, DimensionTrackerListener> {
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

	updateDimensions(canvasEngine: CanvasEngine, ref: HTMLElement) {
		if (!this.enableTracking) {
			return false;
		}

		// store the real dimensions
		this.recompute(canvasEngine, ref.getBoundingClientRect());

		// fire the update event
		this.iterateListeners((listener, event) => {
			if (listener.updated) {
				listener.updated(event);
			}
		});
	}
}
