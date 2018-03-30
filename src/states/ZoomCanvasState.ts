import { CanvasEngine } from "../CanvasEngine";
import { AbstractState } from "../state-machine/AbstractState";
import { MouseWheelInput } from "../state-machine/inputs/MouseWheelInput";
import { StateMachine } from "../state-machine/StateMachine";

export class ZoomCanvasState extends AbstractState {
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super("zooming-canvas", [MouseWheelInput.NAME]);
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		let zoom = machine.getInput(MouseWheelInput.NAME) as MouseWheelInput;

		const model = this.engine.getModel();
		const canvas = this.engine.getCanvasWidget();

		const oldZoomFactor = model.getZoomLevel() / 100;

		// saftey check
		if (model.getZoomLevel() + zoom.amount > 10) {
			model.setZoomLevel(model.getZoomLevel() + zoom.amount);
		}

		const zoomFactor = model.getZoomLevel() / 100;

		const boundingRect = canvas.dimension.realDimensions;
		const clientWidth = boundingRect.getWidth();
		const clientHeight = boundingRect.getHeight();

		// compute difference between rect before and after scroll
		const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
		const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;

		// compute mouse coords relative to canvas
		const clientX = zoom.mouseX - boundingRect.getTopLeft().x;
		const clientY = zoom.mouseY - boundingRect.getTopLeft().y;

		// compute width and height increment factor
		const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
		const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

		model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);

		zoom.eject();
	}

	deactivate(machine: StateMachine) {
		this.engine.getCanvasWidget().forceUpdate();
	}

	process(machine: StateMachine) {}
}
