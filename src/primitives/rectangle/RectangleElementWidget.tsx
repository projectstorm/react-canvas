import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import { RectangleElementModel } from "./RectangleElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import { PressElementEvent, UnPressElementEvent } from "../../event-bus/events/elements";

export interface SquareElementWidgetProps extends BaseWidgetProps {
	model: RectangleElementModel;
	engine: CanvasEngine;
}

export interface SquareElementWidgetState {}

export class RectangleElementWidget extends BaseWidget<SquareElementWidgetProps, SquareElementWidgetState> {
	constructor(props: SquareElementWidgetProps) {
		super("src-primitive-rectangle", props);
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
				onMouseDown={event => {
					this.props.engine.getEventBus().fireEvent(new PressElementEvent(this, this.props.model));
				}}
				onMouseUp={event => {
					this.props.engine.getEventBus().fireEvent(new UnPressElementEvent(this, this.props.model));
				}}
			/>
		);
	}
}
