import { CanvasLayerModel } from "./CanvasLayerModel";
import * as _ from "lodash";
import { GraphModel } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { BaseModel } from "../models/BaseModel";
import { CanvasEngine } from "../CanvasEngine";
import { BaseEvent, BaseListener } from "../models/BaseObject";

export interface CanvasModelListener extends BaseListener<CanvasModel> {
	offsetUpdated?(event: BaseEvent<CanvasModel> & { offsetX: number; offsetY: number }): void;

	zoomUpdated?(event: BaseEvent<CanvasModel> & { zoom: number }): void;
}

export class CanvasModel<T extends CanvasModelListener = CanvasModelListener> extends BaseModel<T> {
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
		};
	}

	deSerialize(data: { [p: string]: any; cache }, engine: CanvasEngine, cache: { [id: string]: BaseModel }): void {
		super.deSerialize(data, engine, cache);
		this.layers.deSerialize(data["layers"], engine, cache);
		this.offsetX = data["offsetX"];
		this.offsetY = data["offsetY"];
		this.zoom = data["zoom"];
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
		this.iterateListeners((listener: CanvasModelListener, event) => {
			if (listener.zoomUpdated) {
				listener.zoomUpdated({ ...event, zoom: zoom });
			}
		});
	}

	setZoomPercent(percent: number) {
		this.setZoomLevel(percent / 100.0);
	}

	setOffset(offsetX: number, offsetY: number) {
		this.offsetX = offsetX;
		this.offsetY = offsetY;
		this.iterateListeners((listener: CanvasModelListener, event) => {
			if (listener.offsetUpdated) {
				listener.offsetUpdated({ ...event, offsetX: offsetX, offsetY: offsetY });
			}
		});
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
			return element.isSelected();
		});
	}
}
