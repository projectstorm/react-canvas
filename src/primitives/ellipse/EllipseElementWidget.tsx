import * as React from 'react';
import { EllipseElementModel } from './EllipseElementModel';
import { BaseWidget, BaseWidgetProps } from '@projectstorm/react-core';

export interface EllipseElementWidgetProps extends BaseWidgetProps {
	model: EllipseElementModel;
}

export interface EllipseElementWidgetState {}

export class EllipseElementWidget extends BaseWidget<EllipseElementWidgetProps, EllipseElementWidgetState> {
	constructor(props: EllipseElementWidgetProps) {
		super('src-ellipsse-element', props);
		this.state = {};
	}

	render() {
		return (
			<ellipse
				{...this.getProps()}
				cx={this.props.model.center.x}
				cy={this.props.model.center.y}
				rx={this.props.model.radiusX}
				ry={this.props.model.radiusX}
				fill={this.props.model.background}
			/>
		);
	}
}
