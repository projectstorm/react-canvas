import { AbstractElementFactory } from '../../AbstractElementFactory';
import { RectangleElementModel } from './RectangleElementModel';
import { RectangleElementWidget } from './RectangleElementWidget';
import * as React from 'react';
import { CanvasEngine } from '../../CanvasEngine';

export class RectangleElementFactory extends AbstractElementFactory<RectangleElementModel> {
  static NAME = 'primitive-rectangle';

  constructor() {
    super(RectangleElementFactory.NAME);
  }

  generateModel(): RectangleElementModel {
    return new RectangleElementModel();
  }

  generateWidget(engine: CanvasEngine, model: RectangleElementModel): JSX.Element {
    return <RectangleElementWidget engine={engine} model={model} />;
  }
}
