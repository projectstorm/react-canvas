import * as React from 'react';
import { BaseWidget, BaseWidgetProps } from '@projectstorm/react-core';
import { PaperElementModel } from './PaperElementModel';

export interface PaperElementWidgetProps extends BaseWidgetProps {
	model: PaperElementModel;
}

export class PaperElementWidget extends BaseWidget<PaperElementWidgetProps> {
	constructor(props) {
		super('src-paper', props);
	}

	render() {
		const dim = this.props.model.getDimensions();
		return (
			<div
				{...this.getProps()}
				style={{
					top: 0,
					left: 0,
					width: dim.getWidth(),
					height: dim.getHeight()
				}}
			/>
		);
	}
}
