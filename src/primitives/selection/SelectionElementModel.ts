import { CanvasElementModel } from '../../models-canvas/CanvasElementModel';
import * as _ from 'lodash';
import { Rectangle } from '../../geometry/Rectangle';
import { DeserializeEvent } from '../../base-models/BaseModel';

export class SelectionElementModel extends CanvasElementModel {
  models: CanvasElementModel[];

  constructor() {
    super('selection');
    this.models = [];
  }

  setModels(models: CanvasElementModel[]) {
    this.models = models;
  }

  getModels(): CanvasElementModel[] {
    return this.models;
  }

  getDimensions(): Rectangle {
    return Rectangle.boundingBoxFromPolygons(
      _.map(this.models, model => {
        return model.getDimensions();
      })
    );
  }

  setDimensions(dimensions: Rectangle) {}

  deSerialize(event: DeserializeEvent): void {
    super.deSerialize(event);
    this.models = _.map(event.data['models'], modelID => {
      return event.cache[modelID];
    }) as any;
  }

  serialize() {
    return {
      ...super.serialize(),
      models: _.map(this.models, model => {
        return model.getID();
      })
    };
  }
}
