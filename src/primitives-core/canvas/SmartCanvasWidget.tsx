import * as React from 'react';
import { BaseEvent, BaseWidget, BaseWidgetProps } from '@projectstorm/react-core';
import * as _ from 'lodash';
import { SimpleCanvasWidget } from './SimpleCanvasWidget';
import { CanvasEngine } from '../../CanvasEngine';
import { CanvasEventWrapperWidget } from './CanvasEventWrapperWidget';
import { DimensionTracker } from '../../tracking/DimensionTracker';
import { CanvasModel } from './CanvasModel';

export interface CanvasWidgetProps extends BaseWidgetProps {
  model: CanvasModel;
  engine: CanvasEngine;
  inverseZoom?: boolean;
}

export interface CanvasWidgetState {}

export class SmartCanvasWidget extends BaseWidget<CanvasWidgetProps, CanvasWidgetState> {
  ref: React.RefObject<HTMLElement>;
  dimension: DimensionTracker;
  dimensionListener: any;
  engineListener: any;

  constructor(props: CanvasWidgetProps) {
    super('src-canvas', props);
    this.state = {};
    this.ref = React.createRef();
    this.dimension = new DimensionTracker();
  }

  componentDidMount(): void {
    this.dimensionListener = this.dimension.addListener({
      updated: (event: BaseEvent<any>) => {
        this.props.model.setViewport(this.dimension.realDimensions);
      }
    });
    this.engineListener = this.props.engine.addListener({
      repaint: () => {
        this.forceUpdate();
      }
    });
  }

  componentWillUnmount(): void {
    this.dimension.removeListener(this.dimensionListener);
    this.props.engine.removeListener(this.engineListener);
  }

  render() {
    return (
      <CanvasEventWrapperWidget refObject={this.ref} engine={this.props.engine}>
        <SimpleCanvasWidget forwardRef={this.ref} dimension={this.dimension}>
          {_.map(this.props.engine.getModel().layers.getArray(), layer => {
            return React.cloneElement(
              this.props.engine.getFactoryForElement(layer).generateWidget(this.props.engine, layer),
              {
                key: layer.getID()
              }
            );
          })}
        </SimpleCanvasWidget>
      </CanvasEventWrapperWidget>
    );
  }
}
