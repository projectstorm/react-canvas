import * as _ from "lodash";
import { GraphModel } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { CanvasModel } from "./CanvasModel";
import {CanvasEngine} from "../CanvasEngine";
import {Serializable} from "../models/BaseModel";

export class CanvasLayerModel extends GraphModel<CanvasElementModel, CanvasModel> {
	name: string;
	elementOrder: CanvasElementModel[];
	svg: boolean;
	transform: boolean;

	constructor(name: string = "Layer") {
		super("layer");
		this.elementOrder = [];
		this.name = name;
		this.svg = false;
		this.transform = true;
	}

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine): void {
		super.deSerialize(data, engine);
		this.name = data['name'];
		this.svg = data['svg'];
		this.transform = data['transform'];
	}


	serialize(): Serializable & any {
		return {
			...super.serialize(),
			name: this.name,
			svg: this.svg,
			transform: this.transform
		};
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
