import * as React from "react";
import { CanvasEngine } from "../../CanvasEngine";
import { GridElementModel } from "./GridElementModel";

export interface GridElementWidgetProps {
	engine: CanvasEngine;
	model: GridElementModel;
}

export interface GridElementWidgetState {}

export class GridElementWidget extends React.Component<GridElementWidgetProps, GridElementWidgetState> {
	constructor(props: GridElementWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		let totalChildrenX = 10;
		let totalChildrenY = 10;

		let childrenX = [];
		for (let i = 0; i < totalChildrenX; i++) {
			let x =
				this.props.engine.getModel().offsetX +
				i * this.props.model.sizeX * this.props.engine.getModel().getZoomLevel();
			childrenX.push(
				<line
					key={"x-" + i}
					stroke={"rgba(0,0,0,0.1)"}
					strokeWidth={1}
					y1={0}
					y2={this.props.engine.getCanvasWidget().dimension.realDimensions.getHeight()}
					x1={x}
					x2={x}
				/>
			);
		}

		let childrenY = [];
		for (let i = 0; i < totalChildrenY; i++) {
			let y =
				this.props.engine.getModel().offsetY +
				i * this.props.model.sizeX * this.props.engine.getModel().getZoomLevel();
			childrenY.push(
				<line
					key={"y-" + i}
					stroke={"rgba(0,0,0,0.1)"}
					strokeWidth={1}
					x1={0}
					x2={this.props.engine.getCanvasWidget().dimension.realDimensions.getWidth()}
					y1={y}
					y2={y}
				/>
			);
		}

		return (
			<g>
				{childrenX}
				{childrenY}
			</g>
		);
	}
}
