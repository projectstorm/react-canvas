import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";
import { CanvasEngine } from "../CanvasEngine";
import * as _ from "lodash";
import { CanvasLayerWidget } from "./CanvasLayerWidget";
import { CanvasLayerModel } from "../models-canvas/CanvasLayerModel";
import { DimensionTrackerWidget } from "../tracking/DimensionTrackerWidget";
import { DimensionTracker } from "../tracking/DimensionTracker";
import { SelectionElementModel } from "../primitives/selection/SelectionElementModel";
import { Rectangle } from "../geometry/Rectangle";
import { CircleElementModel } from "../primitives/circle/CircleElementModel";
import { KeyDownEvent, KeyUpEvent } from "../event-bus/events/key";
import { MouseDownEvent, MouseMoveEvent, MouseUpEvent, MouseWheelEvent } from "../event-bus/events/mouse";

export interface CanvasWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	inverseZoom?: boolean;
}

export interface CanvasWidgetState {}

export class CanvasWidget extends BaseWidget<CanvasWidgetProps, CanvasWidgetState> {
	selectionLayer: CanvasLayerModel;
	debugLayer: CanvasLayerModel;

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

		// selection layer
		this.selectionLayer = new CanvasLayerModel();
		this.selectionLayer.setSVG(false);
		this.selectionLayer.setTransformable(false);

		// debug layer
		this.debugLayer = new CanvasLayerModel();
		this.debugLayer.setSVG(true);
		this.debugLayer.setTransformable(true);

		this.ref = (React as any).createRef();

		this.onKeyDownHandle = (event: any) => {
			this.props.engine.getEventBus().fireEvent(new KeyDownEvent(this, event.key));
		};

		this.onKeyUpHandle = (event: any) => {
			this.props.engine.getEventBus().fireEvent(new KeyUpEvent(this, event.key));
		};

		this.onMouseMoveHandle = (event: MouseEvent) => {
			this.props.engine.getEventBus().fireEvent(new MouseMoveEvent(this, event.clientX, event.clientY));
		};

		this.onMouseDownHandle = (event: MouseEvent) => {
			this.props.engine.getEventBus().fireEvent(new MouseDownEvent(this, event.clientX, event.clientY));
		};

		this.onMouseUpHandle = (event: MouseEvent) => {
			this.props.engine.getEventBus().fireEvent(new MouseUpEvent(this, event.clientX, event.clientY));
		};

		this.onMouseWheelHandle = event => {
			this.props.engine
				.getEventBus()
				.fireEvent(
					new MouseWheelEvent(this, event.clientX, event.clientY, CanvasWidget.normalizeScrollWheel(event))
				);
			event.stopPropagation();
			event.preventDefault();
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
		// selection
		this.selectionLayer.clearEntities();
		let model = this.props.engine.getModel();
		let selected = _.filter(model.getElements(), element => {
			return element.isSelected();
		});
		if (selected.length > 0) {
			let model = new SelectionElementModel();
			model.setModels(selected);
			this.selectionLayer.addEntity(model);
		}

		// debug
		this.debugLayer.clearEntities();
		let models = CircleElementModel.createPointCloudFrom(this.getViewPort());
		_.forEach(models, model => {
			this.debugLayer.addEntity(model);
		});
	}

	componentDidMount() {
		this.computeSelectionLayer();
		document.addEventListener("mousemove", this.onMouseMoveHandle);
		document.addEventListener("keydown", this.onKeyDownHandle);
		document.addEventListener("keyup", this.onKeyUpHandle);
	}

	componentWillUnmount() {
		document.removeEventListener("mousemove", this.onMouseMoveHandle);
		document.removeEventListener("keyup", this.onKeyUpHandle);
		document.removeEventListener("keydown", this.onKeyDownHandle);
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
						return React.cloneElement(
							this.props.engine.getFactoryForElement(layer).generateWidget(this.props.engine, layer),
							{
								key: layer.getID()
							}
						);
					})}
					<CanvasLayerWidget key={"selection"} engine={this.props.engine} layer={this.selectionLayer} />
				</div>
			</DimensionTrackerWidget>
		);
	}
}
