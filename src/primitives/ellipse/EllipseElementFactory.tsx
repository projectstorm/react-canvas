import { AbstractElementFactory } from '../../AbstractElementFactory';
import { EllipseElementModel } from './EllipseElementModel';
import { CanvasEngine } from '../../CanvasEngine';
import { EllipseElementWidget } from './EllipseElementWidget';
import * as React from 'react';

export class EllipseElementFactory extends AbstractElementFactory<EllipseElementModel> {
	static NAME = 'primitive-circle';

	constructor() {
		super(EllipseElementFactory.NAME);
	}

	generateModel(): EllipseElementModel {
		return new EllipseElementModel();
	}

	generateWidget(engine: CanvasEngine, model: EllipseElementModel): JSX.Element {
		return <EllipseElementWidget model={model} />;
	}
}
