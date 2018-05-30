import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "@projectstorm/react-core";
import { SelectionGroupWidget } from "./SelectionGroupWidget";
import { CanvasEngine } from "../../CanvasEngine";
import { SelectionElementModel } from "./SelectionElementModel";

export interface SelectionElementWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	model: SelectionElementModel;
}

export interface SelectionElementWidgetState {}

export class SelectionElementWidget extends BaseWidget<SelectionElementWidgetProps, SelectionElementWidgetState> {
	constructor(props: SelectionElementWidgetProps) {
		super("src-selection-group", props);
		this.state = {};
	}

	render() {
		return <SelectionGroupWidget model={this.props.model} engine={this.props.engine} />;
	}
}
