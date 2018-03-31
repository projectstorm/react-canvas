import { BaseWidget, BaseWidgetProps } from "./BaseWidget";
import * as React from "react";
import { CanvasEngine } from "../CanvasEngine";
import { ModelAnchorInput, ModelAnchorInputPosition } from "../state-machine/inputs/ModelAnchorInput";
import { SelectionElementModel } from "../primitives/selection/SelectionElementModel";
import { ResizeDimensionsState } from "../states/ResizeDimensionsState";

export interface AnchorWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	selectionModel: SelectionElementModel;
	pos: ModelAnchorInputPosition;
}

export class AnchorWidget extends BaseWidget<AnchorWidgetProps> {
	constructor(props) {
		super("src-anchor", props);
	}

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseDown={() => {
					this.props.engine
						.getStateMachine()
						.addInput(new ModelAnchorInput(this.props.selectionModel, this.props.pos));
				}}
				onMouseUp={() => {
					this.props.engine.getStateMachine().removeInput(ModelAnchorInput.NAME);
				}}
			/>
		);
	}
}
