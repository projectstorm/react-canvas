import { Event } from '../Event';
import { Point } from '../../geometry/Point';
import * as _ from 'lodash';
import { CanvasEngine } from '../../CanvasEngine';

export abstract class MouseEvent extends Event {
  mouseX: number;
  mouseY: number;

  constructor(name: string, source: any, mouseX: number, mouseY: number) {
    super(name, source);
    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  getCanvasCoordinates(engine: CanvasEngine): { x: number; y: number } {
    let model = engine.getModel();
    let canDimensions = engine.getCanvasWidget().dimension.realDimensions;

    return {
      x: (this.mouseX - canDimensions.getTopLeft().x - model.getOffsetX()) / model.getZoomLevel(),
      y: (this.mouseY - canDimensions.getTopLeft().y - model.getOffsetY()) / model.getZoomLevel()
    };
  }
}

export class MouseDownEvent extends MouseEvent {
  static NAME = 'mouse-down';

  constructor(source: any, mouseX: number, mouseY: number) {
    super(MouseDownEvent.NAME, source, mouseX, mouseY);
  }
}

export class MouseUpEvent extends MouseEvent {
  static NAME = 'mouse-up';

  constructor(source: any, mouseX: number, mouseY: number) {
    super(MouseUpEvent.NAME, source, mouseX, mouseY);
  }
}

export class MouseMoveEvent extends MouseEvent {
  static NAME = 'mouse-move';

  constructor(source: any, mouseX: number, mouseY: number) {
    super(MouseMoveEvent.NAME, source, mouseX, mouseY);
  }
}

export class MouseWheelEvent extends MouseEvent {
  amount: number;

  static NAME = 'mouse-wheel';

  constructor(source: any, mouseX: number, mouseY: number, amount: number) {
    super(MouseWheelEvent.NAME, source, mouseX, mouseY);
    this.amount = amount;
  }
}
