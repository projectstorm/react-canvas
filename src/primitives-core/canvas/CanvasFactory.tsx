import * as React from 'react';
import { AbstractElementFactory } from '../../base-factories/AbstractElementFactory';
import { CanvasEngine } from '../../CanvasEngine';
import './_SimpleCanvasWidget.scss';
import { CanvasModel } from './CanvasModel';
import { SmartCanvasWidget } from './SmartCanvasWidget';

export class CanvasFactory extends AbstractElementFactory<CanvasModel> {
  constructor() {
    super('canvas');
  }

  generateModel(): CanvasModel {
    return new CanvasModel();
  }

  generateWidget(engine: CanvasEngine, model: CanvasModel): JSX.Element {
    return <SmartCanvasWidget model={model} engine={engine} layer={model} canvasModel={model} />;
  }
}
