import * as _ from "lodash";
import { GraphModel, GraphModelListener } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { CanvasModel } from "./CanvasModel";
import { CanvasEngine } from "../CanvasEngine";
import { BaseModel, Serializable } from "../models/BaseModel";

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

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine, cache: { [id: string]: BaseModel }): void {
		super.deSerialize(data, engine, cache);
		this.name = data["name"];
		this.svg = data["svg"];
		this.transform = data["transform"];
		this.elementOrder = _.map(data["elementOrder"], elementID => {
			return cache[elementID] as any;
		});
	}

	serialize(): Serializable & any {
		return {
			...super.serialize(),
			name: this.name,
			svg: this.svg,
			transform: this.transform,
			elementOrder: _.map(this.elementOrder, "id")
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
