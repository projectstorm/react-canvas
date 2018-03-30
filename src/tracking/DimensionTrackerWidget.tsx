import * as React from "react";
import { BaseWidget, BaseWidgetProps } from "../widgets/BaseWidget";
import { DimensionTracker } from "./DimensionTracker";
import { CanvasEngine } from "../CanvasEngine";

export interface DimensionTrackerWidgetProps extends BaseWidgetProps {
	dimensionTracker: DimensionTracker;
	engine: CanvasEngine;
	element?: any;
}

export interface DimensionTrackerWidgetState {}

export class DimensionTrackerWidget extends BaseWidget<DimensionTrackerWidgetProps, DimensionTrackerWidgetState> {
	ref: HTMLElement;

	public static defaultProps = {
		element: "div"
	};

	constructor(props: DimensionTrackerWidgetProps) {
		super("src-dimension-tracker", props);
		this.state = {};
	}

	updateDimensions() {
		if (this.ref) {
			this.props.dimensionTracker.updateDimensions(this.props.engine, this.ref);
		}
	}

	componentDidMount() {
		this.updateDimensions();
	}

	componentDidUpdate() {
		this.updateDimensions();
	}

	render() {
		return React.createElement(
			this.props.element,
			{
				...this.getProps(),
				ref: ref => {
					this.ref = ref as any;
				}
			},
			this.props.children
		);
	}
}
