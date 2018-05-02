import * as React from "react";
import { EllipseElementModel } from "./EllipseElementModel";

export interface CircleElementWidgetProps {
	model: EllipseElementModel;
}

export interface CircleElementWidgetState {}

export class EllipseElementWidget extends React.Component<CircleElementWidgetProps, CircleElementWidgetState> {
	constructor(props: CircleElementWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<ellipse
				cx={this.props.model.center.x}
				cy={this.props.model.center.y}
				rx={this.props.model.radiusX}
				ry={this.props.model.radiusX}
				fill={this.props.model.background}
			/>
		);
	}
}
