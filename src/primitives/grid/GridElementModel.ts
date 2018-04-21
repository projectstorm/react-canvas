import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { Rectangle } from "../../geometry/Rectangle";
import { CanvasEngine } from "../../CanvasEngine";
import { BaseModel } from "../../models/BaseModel";

export class GridElementModel extends CanvasElementModel {
	sizeX: number;
	sizeY: number;
	color: string;
	thickness: number;

	constructor() {
		super("grid");
		this.sizeX = 50;
		this.sizeY = 50;
		this.color = "rgba(0,0,0,0.1)";
		this.thickness = 1;
	}

	getDimensions(): Rectangle {
		return undefined;
	}

	setDimensions(dimensions: Rectangle) {}

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine, cache: { [p: string]: BaseModel }): void {
		super.deSerialize(data, engine, cache);
		this.sizeX = data["sizeX"];
		this.sizeY = data["sizeY"];
		this.color = data["color"];
		this.thickness = data["thickness"];
	}

	serialize(): { selected: boolean } {
		return {
			...super.serialize(),
			sizeX: this.sizeX,
			sizeY: this.sizeY,
			color: this.color,
			thickness: this.thickness
		};
	}
}
