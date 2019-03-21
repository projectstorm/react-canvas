import { BaseWidget, BaseWidgetProps, MouseWidget } from '@projectstorm/react-core';
import * as React from 'react';

export interface AnchorWidgetProps extends BaseWidgetProps {
	selected: boolean;
	events: {
		mouseUp: () => any;
		mouseDown: () => any;
	};
}

export class AnchorWidget extends BaseWidget<AnchorWidgetProps> {
	constructor(props) {
		super('src-anchor', props);
	}

	render() {
		return (
			<MouseWidget
				element={'div'}
				mouseDownEvent={() => {
					this.props.events.mouseDown();
				}}
				mouseUpEvent={() => {
					this.props.events.mouseUp();
				}}
				extraProps={{
					...this.getProps({
						'--selected': this.props.selected
					})
				}}
			/>
		);
	}
}
