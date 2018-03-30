import * as React from "react";
import { CanvasEngine } from "../CanvasEngine";
import { CanvasLayerModel } from "../models-canvas/CanvasLayerModel";
import * as _ from "lodash";
import { BaseWidget, BaseWidgetProps } from "./BaseWidget";

export interface CanvasLayerWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	layer: CanvasLayerModel;
}

export interface CanvasLayerWidgetState {}

export class CanvasLayerWidget extends BaseWidget<CanvasLayerWidgetProps, CanvasLayerWidgetState> {
	constructor(props: CanvasLayerWidgetProps) {
		super("src-canvas-layer", props);
		this.state = {};
	}

	getProps() {
		let canvas = this.props.engine.getModel();
		let props = super.getProps();

		// do we apply
		if (this.props.layer.transform) {
			props["style"] = {
				...props["style"],
				transform:
					"translate(" +
					canvas.getOffsetX() +
					"px," +
					canvas.getOffsetY() +
					"px) scale(" +
					canvas.getZoomLevel() / 100.0 +
					")"
			};
		}

		return props;
	}

	getChildren() {
		return _.map(this.props.layer.getAllEntities(), element => {
			return React.cloneElement(
				this.props.engine.getFactoryForElement(element).generateWidget(this.props.engine, element),
				{ key: element.getID() }
			);
		});
	}

	render() {
		// it might be an SVG layer
		if (this.props.layer.svg) {
			return <svg {...this.getProps()}>{this.getChildren()}</svg>;
		}
		return <div {...this.getProps()}>{this.getChildren()}</div>;
	}
}
