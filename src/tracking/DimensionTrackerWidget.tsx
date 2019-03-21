import * as React from 'react';
import { BaseWidget, BaseWidgetProps } from '@projectstorm/react-core';
import { DimensionTracker } from './DimensionTracker';
import { CanvasEngine } from '../CanvasEngine';

export interface DimensionTrackerWidgetProps extends BaseWidgetProps {
	dimensionTracker: DimensionTracker;
	engine: CanvasEngine;
	reference: { current: HTMLElement };
}

export interface DimensionTrackerWidgetState {}

export class DimensionTrackerWidget extends BaseWidget<DimensionTrackerWidgetProps, DimensionTrackerWidgetState> {
	observer: any;

	constructor(props: DimensionTrackerWidgetProps) {
		super('src-dimension-tracker', props);
		this.state = {};
	}

	updateDimensions() {
		if (this.props.reference.current) {
			this.props.dimensionTracker.updateDimensions(
				this.props.engine,
				this.props.reference.current.getBoundingClientRect()
			);
		}
	}

	componentDidMount() {
		//if resize observer is present, rather use that
		if (window['ResizeObserver']) {
			this.observer = new window['ResizeObserver'](entries => {
				this.updateDimensions();
			});
			this.observer.observe(this.props.reference.current);
		}
		this.updateDimensions();
	}

	componentDidUpdate() {
		if (!this.observer) {
			this.updateDimensions();
		}
	}

	render() {
		return this.props.children;
	}
}
