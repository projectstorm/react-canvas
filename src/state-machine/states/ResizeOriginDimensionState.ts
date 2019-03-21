import { StateMachine } from '../StateMachine';
import * as _ from 'lodash';
import { CanvasEngine } from '../../CanvasEngine';
import { Rectangle } from '../../geometry/Rectangle';
import { Point } from '../../geometry/Point';
import { AbstractDisplacementState } from '../AbstractDisplacementState';
import { Matrix } from 'mathjs';
import { ModelAnchorInput, ModelAnchorInputPosition } from '../input/ModelAnchorInput';
import { KeyCode, KeyInput } from '../input/KeyInput';

export class ResizeOriginDimensionsState extends AbstractDisplacementState {
	anchorInput: ModelAnchorInput;
	initialDimensions: Rectangle[];
	initialDimension: Rectangle;

	constructor(engine: CanvasEngine) {
		super('resize-origin-dimension', engine);
		this.requireInput(ModelAnchorInput.NAME);
		this.requireInput(KeyInput.identifier(KeyCode.SHIFT));
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		// get the input handles
		this.anchorInput = machine.getInput(ModelAnchorInput.NAME) as ModelAnchorInput;

		// store the initial dimensions
		this.initialDimension = this.anchorInput.selectionModel.getDimensions().clone();
		this.initialDimensions = _.map(this.anchorInput.selectionModel.getModels(), model => {
			return model.getDimensions();
		});
	}

	processDisplacement(displacementX, displacementY) {
		const zoom = this.engine.getModel().getZoomLevel();

		// work out the distance difference
		const distanceX = displacementX / zoom;
		const distanceY = displacementY / zoom;

		// work out the scaling factors for both positive and negative cases
		const scaleX = ((this.initialDimension.getWidth() + distanceX) * 2) / this.initialDimension.getWidth();
		const scaleY = ((this.initialDimension.getHeight() + distanceY) * 2) / this.initialDimension.getHeight();
		const scaleX2 = ((this.initialDimension.getWidth() - distanceX) * 2) / this.initialDimension.getWidth();
		const scaleY2 = ((this.initialDimension.getHeight() - distanceY) * 2) / this.initialDimension.getHeight();

		// construct the correct transform matrix
		let transform: Matrix = null;
		if (this.anchorInput.anchor === ModelAnchorInputPosition.TOP_LEFT) {
			transform = Point.createScaleMatrix(scaleX2, scaleY2, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.TOP) {
			transform = Point.createScaleMatrix(1, scaleY2, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.TOP_RIGHT) {
			transform = Point.createScaleMatrix(scaleX, scaleY2, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.RIGHT) {
			transform = Point.createScaleMatrix(scaleX, 1, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.BOT_RIGHT) {
			transform = Point.createScaleMatrix(scaleX, scaleY, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.BOT) {
			transform = Point.createScaleMatrix(1, scaleY, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.BOT_LEFT) {
			transform = Point.createScaleMatrix(scaleX2, scaleY, this.initialDimension.getOrigin());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.LEFT) {
			transform = Point.createScaleMatrix(scaleX2, 1, this.initialDimension.getOrigin());
		}

		_.forEach(this.anchorInput.selectionModel.getModels(), (model, index) => {
			let dimensions = this.initialDimensions[index].clone();
			dimensions.transform(transform);
			model.setDimensions(dimensions);
		});

		this.engine.repaint();
	}
}
