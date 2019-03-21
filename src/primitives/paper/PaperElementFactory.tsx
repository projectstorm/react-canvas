import { AbstractElementFactory } from '../../AbstractElementFactory';
import { PaperElementModel } from './PaperElementModel';
import { CanvasEngine } from '../../CanvasEngine';
import { PaperElementWidget } from './PaperElementWidget';
import * as React from 'react';

export class PaperElementFactory extends AbstractElementFactory<PaperElementModel> {
	static NAME = 'primitive-paper';

	constructor() {
		super(PaperElementFactory.NAME);
	}

	generateModel(): PaperElementModel {
		return new PaperElementModel();
	}

	generateWidget(engine: CanvasEngine, model: PaperElementModel): JSX.Element {
		return <PaperElementWidget model={model} />;
	}
}
