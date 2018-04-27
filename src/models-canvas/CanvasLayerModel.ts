import { CanvasElementModel } from "./CanvasElementModel";
import { CanvasModel } from "./CanvasModel";
import { CanvasEngine } from "../CanvasEngine";
import { BaseModel, Serializable } from "../models/BaseModel";
import { GraphModelOrdered } from "../models/GraphModelOrdered";

export class CanvasLayerModel extends GraphModelOrdered<CanvasElementModel, CanvasModel> {
	protected name: string;
	protected svg: boolean;
	protected transform: boolean;

	constructor(name: string = "Layer") {
		super("layer");
		this.name = name;
		this.svg = false;
		this.transform = true;
	}

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine, cache: { [id: string]: BaseModel }): void {
		super.deSerialize(data, engine, cache);
		this.name = data["name"];
		this.svg = data["svg"];
		this.transform = data["transform"];
	}

	serialize(): Serializable & any {
		return {
			...super.serialize(),
			name: this.name,
			svg: this.svg,
			transform: this.transform
		};
	}

	setTransformable(transform: boolean) {
		this.transform = transform;
	}

	setName(name: string) {
		this.name = name;
	}

	setSVG(svg: boolean) {
		this.svg = svg;
	}

	getName() {
		return this.name;
	}

	isSVG() {
		return this.svg;
	}

	isTransformable() {
		return this.transform;
	}
}
