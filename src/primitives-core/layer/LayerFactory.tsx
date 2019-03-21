import * as React from 'react';
import { AbstractElementFactory } from '../../base-factories/AbstractElementFactory';
import { LayerModel } from './LayerModel';
import { CanvasEngine } from '../../CanvasEngine';
import {SmartLayerWidget} from "./SmartLayerWidget";
import "./_SimpleLayerWidget.scss"

export class LayerFactory extends AbstractElementFactory<LayerModel> {
  constructor() {
    super('layer');
  }

  generateModel(): LayerModel {
    return new LayerModel();
  }

  generateWidget(engine: CanvasEngine, model: LayerModel): JSX.Element {
    return <SmartLayerWidget engine={engine} layer={model}  canvasModel={engine.getModel()}/>;
  }
}
