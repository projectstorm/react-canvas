import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";
import { CanvasEngine } from "../CanvasEngine";
import * as _ from "lodash";
import { CanvasLayerWidget } from "./CanvasLayerWidget";
import { CanvasLayerModel } from "../models-canvas/CanvasLayerModel";
import { DimensionTrackerWidget } from "../tracking/DimensionTrackerWidget";
import { DimensionTracker } from "../tracking/DimensionTracker";
import { SelectionElementModel } from "../primitives/selection/SelectionElementModel";
import { MouseWheelInput } from "../state-machine/inputs/MouseWheelInput";
import { MouseInput, MouseInputType } from "../state-machine/inputs/MouseInput";
import { Rectangle } from "../geometry/Rectangle";

export interface CanvasWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	inverseZoom?: boolean;
}

export interface CanvasWidgetState {}

export class CanvasWidget extends BaseWidget<CanvasWidgetProps, CanvasWidgetState> {
	selectionLayer: CanvasLayerModel;
	dimension: DimensionTracker;
	ref: { current: HTMLElement };

	// handles
	onKeyDownHandle: (event: any) => any;
	onKeyUpHandle: (event: any) => any;
	onMouseMoveHandle: (event: any) => any;
	onMouseDownHandle: (event: any) => any;
	onMouseUpHandle: (event: any) => any;
	onMouseWheelHandle: (event: WheelEvent) => any;

	constructor(props: CanvasWidgetProps) {
		super("src-canvas", props);
		this.state = {};
		this.dimension = new DimensionTracker();
		this.selectionLayer = new CanvasLayerModel();
		this.selectionLayer.svg = false;
		this.selectionLayer.transform = false;
		this.ref = (React as any).createRef();

		this.onKeyDownHandle = () => {};

		this.onKeyUpHandle = () => {};

		this.onMouseMoveHandle = event => {
			this.props.engine
				.getStateMachine()
				.addInput(new MouseInput(MouseInputType.MOVE, event.clientX, event.clientY));
		};

		this.onMouseDownHandle = event => {
			this.props.engine
				.getStateMachine()
				.addInput(new MouseInput(MouseInputType.DOWN, event.clientX, event.clientY));
		};

		this.onMouseUpHandle = () => {
			this.props.engine.getStateMachine().removeInput(MouseInputType.DOWN);
		};

		this.onMouseWheelHandle = event => {
			let directive = this.props.engine
				.getStateMachine()
				.addInput(new MouseWheelInput(CanvasWidget.normalizeScrollWheel(event), event.clientX, event.clientY));
			if (directive.ejected) {
				event.stopPropagation();
				event.preventDefault();
			}
		};
	}

	static normalizeScrollWheel(event: WheelEvent) {
		let scrollDelta = event.deltaY;
		// check if it is pinch gesture
		if (event.ctrlKey && scrollDelta % 1 !== 0) {
			/*
                Chrome and Firefox sends wheel event with deltaY that
                have fractional part, also `ctrlKey` prop of the event is true
                though ctrl isn't pressed
            */
			return (scrollDelta /= 3);
		}
		return (scrollDelta /= 60);
	}

	componentWillMount() {
		this.props.engine.setCanvasWidget(this);
	}

	computeSelectionLayer() {
		let model = this.props.engine.getModel();
		let selected = _.filter(model.getElements(), element => {
			return element.selected;
		});
		if (selected.length > 0) {
			let model = new SelectionElementModel();
			model.setModels(selected);
			this.selectionLayer.clearEntities();
			this.selectionLayer.addElement(model);
		}
	}

	componentDidMount() {
		this.computeSelectionLayer();
		document.addEventListener("mousemove", this.onMouseMoveHandle);
		this.forceUpdate();
	}

	componentWillUnmount() {
		document.removeEventListener("mousemove", this.onMouseMoveHandle);
	}

	componentWillUpdate() {
		this.computeSelectionLayer();
	}

	getViewPort(): Rectangle {
		let model = this.props.engine.getModel();
		return new Rectangle(
			-model.getOffsetX() / model.getZoomLevel(),
			-model.getOffsetY() / model.getZoomLevel(),
			this.dimension.realDimensions.getWidth() / model.getZoomLevel(),
			this.dimension.realDimensions.getHeight() / model.getZoomLevel()
		);
	}

	zoomToFit(margin: number = 0) {
		let model = this.props.engine.getModel();
		let bounds = Rectangle.boundingBoxFromPolygons(
			_.filter(
				_.map(model.getElements(), element => {
					return element.getDimensions();
				}),
				el => {
					return !!el;
				}
			)
		);

		let zoomFactor = Math.min(
			(this.dimension.realDimensions.getWidth() - margin - margin) / bounds.getWidth(),
			(this.dimension.realDimensions.getHeight() - margin - margin) / bounds.getHeight()
		);

		model.setZoomLevel(zoomFactor);
		model.setOffset(
			margin + -1 * bounds.getTopLeft().x * model.getZoomLevel(),
			margin + -1 * bounds.getTopLeft().y * model.getZoomLevel()
		);
		this.forceUpdate();
	}

	render() {
		return (
			<DimensionTrackerWidget reference={this.ref} engine={this.props.engine} dimensionTracker={this.dimension}>
				<div
					{...this.getProps()}
					ref={this.ref}
					onWheel={this.onMouseWheelHandle}
					onMouseDown={this.onMouseDownHandle}
					onMouseMove={this.onMouseMoveHandle}
					onMouseUp={this.onMouseUpHandle}
				>
					{_.map(this.props.engine.getModel().layers.getEntities(), layer => {
						return <CanvasLayerWidget key={layer.getID()} engine={this.props.engine} layer={layer} />;
					})}
					<CanvasLayerWidget key={"selection"} engine={this.props.engine} layer={this.selectionLayer} />
				</div>
			</DimensionTrackerWidget>
		);
	}
}
