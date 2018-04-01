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
import { CircleElementModel } from "../primitives/circle/CircleElementModel";
import { KeyInput } from "../state-machine/inputs/KeyInput";

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
		this.selectionLayer.svg = false;
		this.selectionLayer.transform = false;

		// debug layer
		this.debugLayer = new CanvasLayerModel();
		this.debugLayer.svg = true;
		this.debugLayer.transform = true;

		this.ref = (React as any).createRef();

		this.onKeyDownHandle = (event: any) => {
			this.props.engine.getStateMachine().addInput(new KeyInput(event.key));
		};

		this.onKeyUpHandle = (event: any) => {
			this.props.engine.getStateMachine().removeInput(KeyInput.identifier(event.key));
		};

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
			if (directive.claimed) {
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
		// selection
		this.selectionLayer.clearEntities();
		let model = this.props.engine.getModel();
		let selected = _.filter(model.getElements(), element => {
			return element.selected;
		});
		if (selected.length > 0) {
			let model = new SelectionElementModel();
			model.setModels(selected);
			this.selectionLayer.addElement(model);
		}

		// debug
		this.debugLayer.clearEntities();
		let models = CircleElementModel.createPointCloudFrom(this.getViewPort());
		_.forEach(models, model => {
			this.debugLayer.addElement(model);
		});
	}

	componentDidMount() {
		this.computeSelectionLayer();
		document.addEventListener("mousemove", this.onMouseMoveHandle);
		document.addEventListener("keydown", this.onKeyDownHandle);
		this.forceUpdate();
	}

	componentWillUnmount() {
		document.removeEventListener("mousemove", this.onMouseMoveHandle);
		document.removeEventListener("keyup", this.onKeyUpHandle);
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
					<CanvasLayerWidget key={"debug"} engine={this.props.engine} layer={this.debugLayer} />
					{_.map(this.props.engine.getModel().layers.getEntities(), layer => {
						return <CanvasLayerWidget key={layer.getID()} engine={this.props.engine} layer={layer} />;
					})}
					<CanvasLayerWidget key={"selection"} engine={this.props.engine} layer={this.selectionLayer} />
				</div>
			</DimensionTrackerWidget>
		);
	}
}
