import { BaseWidget, BaseWidgetProps, MouseWidget } from "@projectstorm/react-core";
import * as React from "react";
import { CanvasEngine } from "../CanvasEngine";
import { SelectionElementModel } from "../primitives/selection/SelectionElementModel";
import { ModelAnchorInput, ModelAnchorInputPosition } from "../state-machine/input/ModelAnchorInput";

export interface AnchorWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	selectionModel: SelectionElementModel;
	pos: ModelAnchorInputPosition;
}

export class AnchorWidget extends BaseWidget<AnchorWidgetProps> {
	constructor(props) {
		super("src-anchor", props);
	}

	componentWillUnmount() {
		this.props.engine.getStateMachine().removeInput(ModelAnchorInput.NAME);
	}

	render() {
		return (
			<MouseWidget
				element={"div"}
				mouseDownEvent={() => {
					this.props.engine
						.getStateMachine()
						.addInput(new ModelAnchorInput(this.props.selectionModel, this.props.pos));
				}}
				mouseUpEvent={() => {
					this.props.engine.getStateMachine().removeInput(ModelAnchorInput.NAME);
				}}
				extraProps={{ ...this.getProps() }}
			/>
		);
	}
}
