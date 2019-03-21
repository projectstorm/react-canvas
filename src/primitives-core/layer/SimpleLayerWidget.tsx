import * as React from 'react';
import { BaseWidget, BaseWidgetProps } from '@projectstorm/react-core';

export interface SimpleLayerWidgetProps extends BaseWidgetProps {
  offsetX?: number;
  offsetY?: number;
  zoom?: number;
  svg: boolean;
}

export class SimpleLayerWidget extends BaseWidget<SimpleLayerWidgetProps> {
  constructor(props: SimpleLayerWidgetProps) {
    super('src-layer', props);
    this.state = {};
  }

  getProps() {
    let props = super.getProps();

    if(this.props.offsetY || this.props.offsetY || this.props.zoom){
      // do we apply
      props['style'] = {
        ...props['style'],
        transform:
          'translate(' + (this.props.offsetX || 0) + 'px,' + (this.props.offsetY || 0) + 'px) scale(' + (this.props.zoom || 0) + ')'
      };
    }
    return props;
  }

  render() {
    // it might be an SVG layer
    if (this.props.svg) {
      return <svg {...this.getProps()}>{this.props.children}</svg>;
    }
    return <div {...this.getProps()}>{this.props.children}</div>;
  }
}
