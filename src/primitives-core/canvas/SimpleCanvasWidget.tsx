import * as React from 'react';
import {BaseWidget, BaseWidgetProps} from '@projectstorm/react-core';
import {DimensionTrackerWidget} from "../../tracking/DimensionTrackerWidget";
import {DimensionTracker} from "../../tracking/DimensionTracker";

export interface CanvasWidgetProps extends BaseWidgetProps {
  forwardRef: React.RefObject<HTMLElement>
  dimension: DimensionTracker;
}

export class SimpleCanvasWidget extends BaseWidget<CanvasWidgetProps> {

  constructor(props: CanvasWidgetProps) {
    super('src-canvas', props);
  }

  render() {
    return (
      <DimensionTrackerWidget reference={this.props.forwardRef} dimensionTracker={this.props.dimension}>
        <div {...this.getProps()} ref={this.props.forwardRef}>
          { this.props.children }
        </div>
      </DimensionTrackerWidget>
    );
  }
}
