import { BaseWidget, BaseWidgetProps, MouseWidget } from '@projectstorm/react-core';
import * as React from 'react';
import { CanvasEngine } from '../CanvasEngine';
import { SelectionElementModel } from '../primitives/selection/SelectionElementModel';
import { ModelAnchorInput, ModelAnchorInputPosition } from '../state-machine/input/ModelAnchorInput';
import { AnchorWidget } from './AnchorWidget';
import { bool } from 'prop-types';

export interface SmartAnchorWidgetProps extends BaseWidgetProps {
	engine: CanvasEngine;
	selectionModel: SelectionElementModel;
	pos: ModelAnchorInputPosition;
}

export interface SmartAnchorWidgetState {
	selected: boolean;
}

export class SmartAnchorWidget extends BaseWidget<SmartAnchorWidgetProps, SmartAnchorWidgetState> {
	constructor(props) {
		super('src-anchor', props);
		this.state = {
			selected: false
		};
	}

	componentWillUnmount() {
		this.props.engine.getStateMachine().removeInput(ModelAnchorInput.NAME);
	}

	render() {
		return (
			<AnchorWidget
				{...this.props}
				selected={this.state.selected}
				events={{
					mouseUp: () => {
						this.props.engine.getStateMachine().removeInput(ModelAnchorInput.NAME);
						this.setState({
							selected: false
						});
					},
					mouseDown: () => {
						this.props.engine
							.getStateMachine()
							.addInput(new ModelAnchorInput(this.props.selectionModel, this.props.pos));
						this.setState({
							selected: true
						});
					}
				}}
			/>
		);
	}
}
