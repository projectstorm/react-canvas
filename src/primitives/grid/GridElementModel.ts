import { CanvasElementModel } from '../../models-canvas/CanvasElementModel';
import { Rectangle } from '../../geometry/Rectangle';
import { DeserializeEvent } from '../../base-models/BaseModel';
import { GridElementFactory } from './GridElementFactory';

export class GridElementModel extends CanvasElementModel {
  sizeX: number;
  sizeY: number;
  color: string;
  thickness: number;

  constructor() {
    super(GridElementFactory.NAME);
    this.sizeX = 50;
    this.sizeY = 50;
    this.color = 'rgba(0,0,0,0.1)';
    this.thickness = 1;
  }

  getDimensions(): Rectangle {
    return undefined;
  }

  setDimensions(dimensions: Rectangle) {}

  deSerialize(event: DeserializeEvent): void {
    super.deSerialize(event);
    this.sizeX = event.data['sizeX'];
    this.sizeY = event.data['sizeY'];
    this.color = event.data['color'];
    this.thickness = event.data['thickness'];
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
