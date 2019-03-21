import { CanvasLayerModel } from './CanvasLayerModel';
import * as _ from 'lodash';
import { CanvasElementModel } from './CanvasElementModel';
import { BaseModel, BaseModelListener, DeserializeEvent } from '../base-models/BaseModel';
import { GraphModelOrdered } from '../base-models/GraphModelOrdered';
import { BaseEvent } from '@projectstorm/react-core';

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
		super('canvas');
		this.selectedLayer = null;
		this.layers = new GraphModelOrdered('layers');
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

	deSerialize(event: DeserializeEvent): void {
		super.deSerialize(event);
		this.layers.deSerialize(event.subset('layers'));
		this.offsetX = event.data['offsetX'];
		this.offsetY = event.data['offsetY'];
		this.zoom = event.data['zoom'];
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
		this.iterateListeners('zoom changed', (listener: CanvasModelListener, event) => {
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
		this.iterateListeners('offset changed', (listener: CanvasModelListener, event) => {
			if (listener.offsetUpdated) {
				listener.offsetUpdated({ ...event, offsetX: offsetX, offsetY: offsetY });
			}
		});
	}

	removeLayer(layer: CanvasLayerModel) {
		this.layers.removeModel(layer);
	}

	addLayer(layer: CanvasLayerModel) {
		this.layers.addModel(layer);
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
