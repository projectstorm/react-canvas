import { CanvasLayerModel } from "./CanvasLayerModel";
import * as _ from "lodash";
import { GraphModel } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { BaseModel } from "../models/BaseModel";
import {CanvasEngine} from "../CanvasEngine";

export class CanvasModel extends BaseModel {
	selectedLayer: CanvasLayerModel;
	layers: GraphModel<CanvasLayerModel, CanvasModel>;

	//control variables
	offsetX: number;
	offsetY: number;
	zoom: number;

	constructor() {
		super("canvas");
		this.selectedLayer = null;
		this.layers = new GraphModel("layers");
		this.layers.setParent(this);
		this.offsetX = 0;
		this.offsetY = 0;
		this.zoom = 1;
	}

	serialize(): any {
		return {
			...super.serialize(),
			layers: this.layers.serialize(),
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			zoom: this.zoom
		}
	}

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine): void {
		super.deSerialize(data, engine);
		this.layers.deSerialize(data['layers'], engine);
		this.offsetX = data['offsetX'];
		this.offsetY = data['offsetY'];
		this.zoom = data['zoom'];
	}

	getOffsetY() {
		return this.offsetY;
	}

	getOffsetX() {
		return this.offsetX;
	}

	getZoomLevel() {
		return this.zoom;
	}

	setZoomLevel(zoom: number) {
		this.zoom = zoom;
	}

	setZoomPercent(percent: number) {
		this.zoom = percent / 100.0;
	}

	setOffset(offsetX: number, offsetY: number) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
	}

	addLayer(layer: CanvasLayerModel) {
		this.layers.addEntity(layer);
		this.selectedLayer = layer;
	}

	getElements(): CanvasElementModel[] {
		return _.flatMap(this.layers.getEntities(), layer => {
			return _.values(layer.getEntities());
		});
	}

	getSelectedEntities(): CanvasElementModel[] {
		return _.filter(this.getElements(), element => {
			return element.selected;
		});
	}
}
