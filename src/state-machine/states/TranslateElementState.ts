import * as _ from "lodash";
import { AbstractDisplacementState } from "../AbstractDisplacementState";
import { StateMachine } from "../StateMachine";
import { CanvasEngine } from "../../CanvasEngine";
import { Rectangle } from "../../geometry/Rectangle";
import { ModelElementInput } from "../input/ModelElementInput";
import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";

export class TranslateElementState extends AbstractDisplacementState {
	initialPosition: { [id: string]: Rectangle };
	initialEntities: { [id: string]: CanvasElementModel };

	constructor(engine: CanvasEngine) {
		super("translate-element", engine);
		this.requireInput(ModelElementInput.NAME);
	}

	activated(machine: StateMachine) {
		super.activated(machine);
		this.initialPosition = {};
		this.initialEntities = {};
		let selected = this.engine.getModel().getSelectedEntities();
		_.forEach(selected, selected => {
			this.initialEntities[selected.getID()] = selected;
			this.initialPosition[selected.getID()] = selected.getDimensions().clone();
		});
	}

	processDisplacement(displacementX, displacementY) {
		_.forEach(this.initialPosition, (initialPosition, index) => {
			const dim = initialPosition.clone();
			dim.updateDimensions(
				initialPosition.getTopLeft().x + displacementX / this.engine.getModel().getZoomLevel(),
				initialPosition.getTopLeft().y + displacementY / this.engine.getModel().getZoomLevel(),
				dim.getWidth(),
				dim.getHeight()
			);
			this.initialEntities[index].setDimensions(dim);
		});
		this.engine.repaint();
	}
}
