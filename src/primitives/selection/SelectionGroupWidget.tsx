import * as React from 'react';
import { BaseWidget, BaseWidgetProps, MouseWidget } from '@projectstorm/react-core';
import { AnchorWidget } from '../../primitives-core/anchor/AnchorWidget';
import { CanvasEngine } from '../../CanvasEngine';
import { SelectionElementModel } from './SelectionElementModel';
import { ModelAnchorInputPosition } from '../../state-machine/input/ModelAnchorInput';
import { ModelRotateInput } from '../../state-machine/input/ModelRotateInput';
import { SmartAnchorWidget } from '../../primitives-core/anchor/SmartAnchorWidget';

export interface SelectionGroupWidgetProps extends BaseWidgetProps {
  model: SelectionElementModel;
  engine: CanvasEngine;
}

export interface SelectionGroupWidgetState {}

export class SelectionGroupWidget extends BaseWidget<SelectionGroupWidgetProps, SelectionGroupWidgetState> {
  constructor(props: SelectionGroupWidgetProps) {
    super('src-selection-group', props);
    this.state = {};
  }

  render() {
    let dimension = this.props.model.getDimensions().toRealDimensions(this.props.engine.getModel());
    return (
      <div
        style={{
          left: dimension.getTopLeft().x,
          top: dimension.getTopLeft().y,
          width: dimension.getWidth(),
          height: dimension.getHeight()
        }}
        {...this.getProps()}>
        <MouseWidget
          element="div"
          extraProps={{
            className: this.bem('__rotate')
          }}
          mouseDownEvent={() => {
            this.props.engine.getStateMachine().addInput(new ModelRotateInput(this.props.model));
          }}
          mouseUpEvent={() => {
            this.props.engine.getStateMachine().removeInput(ModelRotateInput.NAME);
          }}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.TOP_LEFT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__top-left')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.TOP}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__top')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.TOP_RIGHT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__top-right')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.LEFT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__left')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.RIGHT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__right')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.BOT_LEFT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__bot-left')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.BOT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__bot')}
        />
        <SmartAnchorWidget
          pos={ModelAnchorInputPosition.BOT_RIGHT}
          selectionModel={this.props.model}
          engine={this.props.engine}
          className={this.bem('__bot-right')}
        />
      </div>
    );
  }
}
