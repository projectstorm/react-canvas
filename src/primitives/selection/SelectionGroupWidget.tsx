import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import { AnchorWidget } from "../../widgets/AnchorWidget";
import { CanvasEngine } from "../../CanvasEngine";
import { SelectionElementModel } from "./SelectionElementModel";
import { ModelAnchorInputPosition } from "../../state-machine/input/ModelAnchorInput";

export interface SelectionGroupWidgetProps extends BaseWidgetProps {
	model: SelectionElementModel;
	engine: CanvasEngine;
}

export interface SelectionGroupWidgetState {}

export class SelectionGroupWidget extends BaseWidget<SelectionGroupWidgetProps, SelectionGroupWidgetState> {
	constructor(props: SelectionGroupWidgetProps) {
		super("src-selection-group", props);
		this.state = {};
	}

	render() {
		let dimension = this.props.model.getDimensions().toRealDimensions(this.props.engine.getModel());
		return (
			<div
				style={{
					left: dimension.getTopLeft().x,
					top: dimension.getTopLeft().y,
					width: dimension.getWidth(),
					height: dimension.getHeight()
				}}
				{...this.getProps()}
			>
				<AnchorWidget
					pos={ModelAnchorInputPosition.TOP_LEFT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__top-left")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.TOP}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__top")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.TOP_RIGHT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__top-right")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.LEFT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__left")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.RIGHT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__right")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.BOT_LEFT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__bot-left")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.BOT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__bot")}
				/>
				<AnchorWidget
					pos={ModelAnchorInputPosition.BOT_RIGHT}
					selectionModel={this.props.model}
					engine={this.props.engine}
					className={this.bem("__bot-right")}
				/>
			</div>
		);
	}
}
