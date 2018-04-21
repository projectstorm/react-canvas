import { CanvasEngine } from "../../CanvasEngine";
import { AbstractState } from "../AbstractState";
import { StateMachine } from "../StateMachine";
import {MouseWheelEventInput} from "../input-events/MouseWheelEventInput";

export class ZoomCanvasState extends AbstractState {
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super("zooming-canvas");
		this.requireInput(MouseWheelEventInput.NAME);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		let zoom = machine.getInput(MouseWheelEventInput.NAME) as MouseWheelEventInput;

		const model = this.engine.getModel();
		const canvas = this.engine.getCanvasWidget();

		let newZoomFactor = model.getZoomLevel() + zoom.amount / 100.0;
		if (newZoomFactor <= 0.1) {
			machine.removeInput(MouseWheelEventInput.NAME);
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
		const clientX = zoom.mouseX - boundingRect.getTopLeft().x;
		const clientY = zoom.mouseY - boundingRect.getTopLeft().y;

		// compute width and height increment factor
		const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
		const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

		model.setZoomLevel(newZoomFactor);
		model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);

		machine.removeInput(MouseWheelEventInput.NAME);
	}

	deactivate(machine: StateMachine) {
		this.engine.getCanvasWidget().forceUpdate();
	}

	process(machine: StateMachine) {}
}
