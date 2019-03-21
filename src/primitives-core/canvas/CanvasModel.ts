import { LayerModel } from '../layer/LayerModel';
import * as _ from 'lodash';
import { CanvasElementModel } from '../../models-canvas/CanvasElementModel';
import { BaseModel, BaseModelListener, DeserializeEvent } from '../../base-models/BaseModel';
import { GraphModelOrdered } from '../../base-models/GraphModelOrdered';
import { BaseEvent } from '@projectstorm/react-core';
import { Rectangle } from '../../geometry/Rectangle';

export interface CanvasModelListener<T extends CanvasModel = any> extends BaseModelListener<T> {
  offsetUpdated?(event: BaseEvent<T> & { offsetX: number; offsetY: number }): void;

  zoomUpdated?(event: BaseEvent<T> & { zoom: number }): void;

  viewportChanged?(event: BaseEvent<T> & { viewport: Rectangle });
}

export class CanvasModel<T extends CanvasModelListener = CanvasModelListener> extends BaseModel<null, T> {
  selectedLayer: LayerModel;
  layers: GraphModelOrdered<LayerModel, CanvasModel>;

  //control variables
  offsetX: number;
  offsetY: number;
  viewport: Rectangle;
  zoom: number;

  constructor() {
    super('canvas');
    this.selectedLayer = null;
    this.layers = new GraphModelOrdered('layers');
    this.layers.setParentDelegate(this);
    this.offsetX = 0;
    this.offsetY = 0;
    this.viewport = new Rectangle();
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

  setViewport(rect: Rectangle) {
    this.viewport = rect;
    this.iterateListeners('viewport changed', (listener: CanvasModelListener, event) => {
      if (listener.viewportChanged) {
        listener.viewportChanged({ ...event, viewport: rect });
      }
    });
  }

  setZoomLevel(zoom: number) {
    if (zoom < 0) {
      throw new Error('Zoom cannot be below zero');
    }
    this.zoom = zoom;
    this.iterateListeners('zoom changed', (listener: CanvasModelListener, event) => {
      if (listener.zoomUpdated) {
        listener.zoomUpdated({ ...event, zoom: zoom });
      }
    });
  }

  setZoomPercent(percent: number | string) {
    // also accept string like '100%'
    if (typeof percent === 'string') {
      percent = _.parseInt(_.trimEnd(percent, ' %'));
    }
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

  removeLayer(layer: LayerModel) {
    this.layers.removeModel(layer);
  }

  addLayer(layer: LayerModel) {
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

  zoomToFit(margin: number = 0) {
    let bounds = Rectangle.boundingBoxFromPolygons(
      _.filter(
        _.map(this.getElements(), element => {
          return element.getDimensions();
        }),
        el => {
          return !!el;
        }
      )
    );

    let zoomFactor = Math.min(
      (this.viewport.getWidth() - margin - margin) / bounds.getWidth(),
      (this.viewport.getHeight() - margin - margin) / bounds.getHeight()
    );

    this.setZoomLevel(zoomFactor);
    this.setOffset(margin + -1 * bounds.getTopLeft().x * this.zoom, margin + -1 * bounds.getTopLeft().y * this.zoom);
  }
}
