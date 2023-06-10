import * as React from 'react';
import * as _ from 'lodash';
import { CanvasEngine } from '../../CanvasEngine';
import { LayerModel } from './LayerModel';
import { SimpleLayerWidget } from './SimpleLayerWidget';
import { CanvasModel } from '../canvas/CanvasModel';

export interface SmartLayerWidgetProps {
  engine: CanvasEngine;
  layer: LayerModel;
  canvasModel: CanvasModel;
}

export class SmartLayerWidget extends React.Component<SmartLayerWidgetProps> {
  constructor(props: SmartLayerWidgetProps) {
    super(props);
    this.state = {};
  }

  getChildren() {
    return _.map(this.props.layer.getAllEntities(), element => {
      return React.cloneElement(
        this.props.engine.getFactoryForElement(element).generateWidget(this.props.engine, element),
        { key: element.getID() }
      );
    });
  }

  render() {
    return (
      <SimpleLayerWidget
        svg={this.props.layer.isSVG()}
        engine={this.props.engine}
        offsetX={this.props.canvasModel.getOffsetX()}
        offsetY={this.props.canvasModel.getOffsetY()}
        zoom={this.props.canvasModel.getZoomLevel()}>
        {this.getChildren()}
      </SimpleLayerWidget>
    );
  }
}
