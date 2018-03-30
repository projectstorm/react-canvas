import { AbstractState } from "../state-machine/AbstractState";
import { StateMachine } from "../state-machine/StateMachine";
import { MouseInput, MouseInputType } from "../state-machine/inputs/MouseInput";
import { ModelAnchorInput, ModelAnchorInputPosition } from "../state-machine/inputs/ModelAnchorInput";
import * as _ from "lodash";
import { CanvasEngine } from "../CanvasEngine";
import { Rectangle } from "../geometry/Rectangle";
import { Point } from "../geometry/Point";
import Matrix = mathjs.Matrix;

export class ResizeDimensionsState extends AbstractState {
	initialPoint: MouseInput;
	anchorInput: ModelAnchorInput;
	initialDimensions: Rectangle[];
	initialDimension: Rectangle;
	distanceX: number;
	distanceY: number;
	engine: CanvasEngine;

	constructor(engine: CanvasEngine) {
		super("resize-dimension", [MouseInputType.DOWN, MouseInputType.MOVE, ModelAnchorInput.NAME]);

		this.engine = engine;
	}

	activated(machine: StateMachine) {
		// get the input handles
		this.initialPoint = machine.getInput(MouseInputType.DOWN) as MouseInput;
		this.anchorInput = machine.getInput(ModelAnchorInput.NAME) as ModelAnchorInput;

		// store the initial dimensions
		this.initialDimension = this.anchorInput.selectionModel.getDimensions().clone();
		this.initialDimensions = _.map(this.anchorInput.selectionModel.getModels(), model => {
			return model.getDimensions();
		});

		// reset the distances
		this.distanceX = 0;
		this.distanceY = 0;

		// lock the anchor until we are done
		machine.getInput(ModelAnchorInput.NAME).lock();
	}

	process(machine: StateMachine) {
		let movePoint = machine.getInput(MouseInputType.MOVE) as MouseInput;

		let zoom = this.engine.getModel().getZoomLevel() / 100.0;

		// work out the distance difference
		this.distanceX = (movePoint.mouseX - this.initialPoint.mouseX) / zoom;
		this.distanceY = (movePoint.mouseY - this.initialPoint.mouseY) / zoom;

		// work out the scaling factor
		let scaleX = (this.initialDimension.getWidth() + this.distanceX) / this.initialDimension.getWidth();
		let scaleY = (this.initialDimension.getHeight() + this.distanceY) / this.initialDimension.getHeight();

		let scaleX2 = (this.initialDimension.getWidth() - this.distanceX) / this.initialDimension.getWidth();
		let scaleY2 = (this.initialDimension.getHeight() - this.distanceY) / this.initialDimension.getHeight();

		// construct the correct transform matrix
		let transform: Matrix = null;
		if (this.anchorInput.anchor === ModelAnchorInputPosition.TOP_LEFT) {
			transform = Point.createScaleMatrix(scaleX2, scaleY2, this.initialDimension.getBottomRight());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.TOP) {
			transform = Point.createScaleMatrix(1, scaleY2, this.initialDimension.getBottomMiddle());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.TOP_RIGHT) {
			transform = Point.createScaleMatrix(scaleX, scaleY2, this.initialDimension.getBottomLeft());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.RIGHT) {
			transform = Point.createScaleMatrix(scaleX, 1, this.initialDimension.getLeftMiddle());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.BOT_RIGHT) {
			transform = Point.createScaleMatrix(scaleX, scaleY, this.initialDimension.getTopLeft());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.BOT) {
			transform = Point.createScaleMatrix(1, scaleY, this.initialDimension.getTopMiddle());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.BOT_LEFT) {
			transform = Point.createScaleMatrix(scaleX2, scaleY, this.initialDimension.getTopRight());
		} else if (this.anchorInput.anchor === ModelAnchorInputPosition.LEFT) {
			transform = Point.createScaleMatrix(scaleX2, 1, this.initialDimension.getRightMiddle());
		}

		_.forEach(this.anchorInput.selectionModel.getModels(), (model, index) => {
			let dimensions = this.initialDimensions[index].clone();
			dimensions.transform(transform);
			model.setDimensions(dimensions);
		});

		this.engine.getCanvasWidget().forceUpdate();
	}

	deactivate(machine: StateMachine) {
		machine.getInput(ModelAnchorInput.NAME).eject();
	}
}
