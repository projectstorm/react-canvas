import { Event } from '../Event';
import { CanvasElementModel } from '../../models-canvas/CanvasElementModel';

export class ElementEvent extends Event {
  element: CanvasElementModel;

  constructor(name: string, source: any, element: CanvasElementModel) {
    super(name, source);
    this.element = element;
  }
}

export class PressElementEvent extends ElementEvent {
  static NAME = 'press-element';

  constructor(source: any, element: CanvasElementModel) {
    super(PressElementEvent.NAME, source, element);
  }
}

export class UnPressElementEvent extends ElementEvent {
  static NAME = 'unpress-element';

  constructor(source: any, element: CanvasElementModel) {
    super(UnPressElementEvent.NAME, source, element);
  }
}
