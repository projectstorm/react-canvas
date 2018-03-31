import { CanvasLayerModel } from "./CanvasLayerModel";
import * as _ from "lodash";
import { GraphModel } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { BaseModel } from "../models/BaseModel";

export class CanvasModel extends BaseModel {
	selectedLayer: CanvasLayerModel;
	layers: GraphModel<CanvasLayerModel, CanvasModel>;

	//control variables
	offsetX: number;
	offsetY: number;
	zoom: number;

	constructor() {
		super();
		this.selectedLayer = null;
		this.layers = new GraphModel();
		this.layers.setParent(this);
		this.offsetX = 0;
		this.offsetY = 0;
		this.zoom = 1;
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
