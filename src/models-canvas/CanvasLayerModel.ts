import * as _ from "lodash";
import { GraphModel } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { CanvasModel } from "./CanvasModel";

export class CanvasLayerModel extends GraphModel<CanvasElementModel, CanvasModel> {
	name: string;
	elementOrder: CanvasElementModel[];
	svg: boolean;
	transform: boolean;

	constructor(name: string = "Layer") {
		super();
		this.elementOrder = [];
		this.name = name;
		this.svg = false;
		this.transform = true;
	}

	addElement(element: CanvasElementModel) {
		super.addEntity(element);
		this.elementOrder.push(element);
	}

	removeElement(element: CanvasElementModel) {
		super.removeEntity(element);
		this.elementOrder.splice(this.elementOrder.indexOf(element), 1);
	}

	removeElements(...elements: CanvasElementModel[]) {
		_.forEach(elements, element => {
			this.removeElement(element);
		});
	}

	moveElementToBack(element: CanvasElementModel) {
		let index = this.elementOrder.indexOf(element);
		if (index === -1) {
			return;
		}
		this.elementOrder.splice(0, 0, element);
	}

	moveElementToFront(element: CanvasElementModel) {
		let index = this.elementOrder.indexOf(element);
		if (index === -1) {
			return;
		}
		this.elementOrder.splice(index, 1);
		this.elementOrder.push(element);
	}

	moveElement(element: CanvasElementModel, forward: boolean = true) {
		let index = this.elementOrder.indexOf(element);
		if (index === -1) {
			return;
		}
		this.elementOrder.splice(index, 1);
		this.elementOrder.splice(forward ? index : index - 1, 0, element);
	}
}
