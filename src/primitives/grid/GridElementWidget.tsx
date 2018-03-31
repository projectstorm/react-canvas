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
		let childrenX = [];
		let offsetX =
			this.props.engine.getModel().offsetX %
			(this.props.model.sizeX * this.props.engine.getModel().getZoomLevel());
		let spacingX = this.props.model.sizeX * this.props.engine.getModel().getZoomLevel();
		let totalChildrenX = this.props.engine.getCanvasWidget().dimension.realDimensions.getWidth() / spacingX;
		for (let i = 0; i < totalChildrenX; i++) {
			let x = offsetX + spacingX * i;
			childrenX.push(
				<line
					key={"x-" + i}
					stroke={this.props.model.color}
					strokeWidth={this.props.model.thickness}
					y1={0}
					y2={this.props.engine.getCanvasWidget().dimension.realDimensions.getHeight()}
					x1={x}
					x2={x}
				/>
			);
		}

		let childrenY = [];
		let offsetY =
			this.props.engine.getModel().offsetY %
			(this.props.model.sizeY * this.props.engine.getModel().getZoomLevel());
		let spacingY = this.props.model.sizeY * this.props.engine.getModel().getZoomLevel();
		let totalChildrenY = this.props.engine.getCanvasWidget().dimension.realDimensions.getHeight() / spacingY;
		for (let i = 0; i < totalChildrenY; i++) {
			let y = offsetY + spacingY * i;
			childrenY.push(
				<line
					key={"y-" + i}
					stroke={this.props.model.color}
					strokeWidth={this.props.model.thickness}
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
