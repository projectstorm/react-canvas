import { Action } from '../Action';
import { MouseWheelEvent } from '../events/mouse';
import { CanvasEngine } from '../../CanvasEngine';

export class ZoomCanvasAction extends Action<MouseWheelEvent> {
  engine: CanvasEngine;

  constructor(engine: CanvasEngine) {
    super(MouseWheelEvent.NAME);
    this.engine = engine;
  }

  doAction(event: MouseWheelEvent) {
    const model = this.engine.getModel();

    let newZoomFactor = model.getZoomLevel() + event.amount / 100.0;
    if (newZoomFactor <= 0.1) {
      return;
    }

    const oldZoomFactor = model.getZoomLevel();

    const clientWidth = model.viewport.getWidth();
    const clientHeight = model.viewport.getHeight();

    // compute difference between rect before and after scroll
    const widthDiff = clientWidth * newZoomFactor - clientWidth * oldZoomFactor;
    const heightDiff = clientHeight * newZoomFactor - clientHeight * oldZoomFactor;

    // compute mouse coords relative to canvas
    const clientX = event.mouseX - model.viewport.getTopLeft().x;
    const clientY = event.mouseY - model.viewport.getTopLeft().y;

    // compute width and height increment factor
    const xFactor = (clientX - model.getOffsetX()) / oldZoomFactor / clientWidth;
    const yFactor = (clientY - model.getOffsetY()) / oldZoomFactor / clientHeight;

    model.setZoomLevel(newZoomFactor);
    model.setOffset(model.getOffsetX() - widthDiff * xFactor, model.getOffsetY() - heightDiff * yFactor);
    this.engine.repaint();
  }
}
