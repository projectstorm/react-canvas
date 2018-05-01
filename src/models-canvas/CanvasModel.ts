import { CanvasLayerModel } from "./CanvasLayerModel";
import * as _ from "lodash";
import { GraphModel } from "../models/GraphModel";
import { CanvasElementModel } from "./CanvasElementModel";
import { BaseModel, BaseModelListener } from "../models/BaseModel";
import { CanvasEngine } from "../CanvasEngine";
import { BaseEvent, BaseListener } from "../models/BaseObject";
import { GraphModelOrdered } from "../models/GraphModelOrdered";

export interface CanvasModelListener<T extends CanvasModel = any> extends BaseModelListener<T> {
	offsetUpdated?(event: BaseEvent<T> & { offsetX: number; offsetY: number }): void;

	zoomUpdated?(event: BaseEvent<T> & { zoom: number }): void;
}

export class CanvasModel<T extends CanvasModelListener = CanvasModelListener> extends BaseModel<null, T> {
	selectedLayer: CanvasLayerModel;
	layers: GraphModelOrdered<CanvasLayerModel, CanvasModel>;

	//control variables
	offsetX: number;
	offsetY: number;
	zoom: number;

	constructor() {
		super("canvas");
		this.selectedLayer = null;
		this.layers = new GraphModelOrdered("layers");
		this.layers.setParentDelegate(this);
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

	removeLayer(layer: CanvasLayerModel) {
		this.layers.removeEntity(layer);
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
