import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import { SquareElementModel } from "./SquareElementModel";
import { CanvasEngine } from "../../CanvasEngine";

export interface SquareElementWidgetProps extends BaseWidgetProps {
	model: SquareElementModel;
	engine: CanvasEngine;
}

export interface SquareElementWidgetState {}

export class SquareElementWidget extends BaseWidget<SquareElementWidgetProps, SquareElementWidgetState> {
	constructor(props: SquareElementWidgetProps) {
		super("src-primitive-square", props);
		this.state = {};
	}

	render() {
		let dimensions = this.props.model.dimensions;
		return (
			<rect
				{...this.getProps()}
				x={dimensions.getTopLeft().x}
				y={dimensions.getTopLeft().y}
				width={dimensions.getWidth()}
				height={dimensions.getHeight()}
				onMouseOver={() => {
					this.props.model.setSelected(true);
					this.props.engine.getCanvasWidget().forceUpdate();
				}}
			/>
		);
	}
}
