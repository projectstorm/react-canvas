import { Action } from "../Action";
import { MouseWheelEvent } from "../events/mouse";
import { CanvasEngine } from "../../CanvasEngine";

export class ZoomCanvasAction extends Action<MouseWheelEvent> {
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super(MouseWheelEvent.NAME);
		this.engine = engine;
	}

	doAction(event: MouseWheelEvent) {
		const model = this.engine.getModel();
		const canvas = this.engine.getCanvasWidget();

		let newZoomFactor = model.getZoomLevel() + event.amount / 100.0;
		if (newZoomFactor <= 0.1) {
			return;
		}

		const oldZoomFactor = model.getZoomLevel();

		const boundingRect = canvas.dimension.realDimensions;
		const clientWidth = boundingRect.getWidth();
		const clientHeight = boundingRect.getHeight();

		// compute difference between rect before and after scroll
		const widthDiff = clientWidth * newZoomFactor - clientWidth * oldZoomFactor;
		const heightDiff = clientHeight * newZoomFactor - clientHeight * oldZoomFactor;

		// compute mouse coords relative to canvas
		const clientX = event.mouseX - boundingRect.getTopLeft().x;
		const clientY = event.mouseY - boundingRect.getTopLeft().y;

		// compute width and height increment factor
		const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
		const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

		model.setZoomLevel(newZoomFactor);
		model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);
		this.engine.repaint();
	}
}
