import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import { SquareElementModel } from "./SquareElementModel";
import { CanvasEngine } from "../../CanvasEngine";
import {ModelElementInput} from "../../state-machine/input/ModelElementInput";
import {MouseDownInput} from "../../state-machine/input/MouseDownInput";

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
				onMouseDown={(event) => {
					event.stopPropagation();
					this.props.engine.getStateMachine().addInput(new MouseDownInput(event.clientX, event.clientY), false);
					this.props.engine.getStateMachine().addInput(new ModelElementInput(this.props.model));
				}}
				onMouseUp={(event) => {
					event.stopPropagation();
					this.props.engine.getStateMachine().removeInput(MouseDownInput.NAME, false);
					this.props.engine.getStateMachine().removeInput(ModelElementInput.NAME);
				}}
			/>
		);
	}
}
