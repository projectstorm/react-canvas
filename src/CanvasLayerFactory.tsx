import * as React from 'react';
import { AbstractElementFactory } from './AbstractElementFactory';
import { CanvasLayerModel } from './models-canvas/CanvasLayerModel';
import { CanvasEngine } from './CanvasEngine';
import { CanvasLayerWidget } from './widgets/CanvasLayerWidget';

export class CanvasLayerFactory extends AbstractElementFactory<CanvasLayerModel> {
  constructor() {
    super('layer');
  }

  generateModel(): CanvasLayerModel {
    return new CanvasLayerModel();
  }

  generateWidget(engine: CanvasEngine, model: CanvasLayerModel): JSX.Element {
    return <CanvasLayerWidget engine={engine} layer={model} />;
  }
}
