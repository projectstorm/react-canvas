import * as React from 'react';
import { CanvasEngine } from '../../CanvasEngine';
import { KeyDownEvent, KeyUpEvent } from '../../event-bus/events/key';
import { MouseDownEvent, MouseMoveEvent, MouseUpEvent, MouseWheelEvent } from '../../event-bus/events/mouse';

export interface CanvasEventWrapperWidgetProps {
  engine: CanvasEngine;
  inverseZoom?: boolean;
  refObject: React.RefObject<HTMLElement>;
}

export class CanvasEventWrapperWidget extends React.Component<CanvasEventWrapperWidgetProps> {
  // handles
  onKeyDownHandle: (event: any) => any;
  onKeyUpHandle: (event: any) => any;
  onMouseMoveHandle: (event: any) => any;
  onMouseDownHandle: (event: any) => any;
  onMouseUpHandle: (event: any) => any;
  onMouseWheelHandle: (event: any) => any;

  constructor(props: CanvasEventWrapperWidgetProps) {
    super(props);

    this.onKeyDownHandle = (event: any) => {
      this.props.engine.getEventBus().fireEvent(new KeyDownEvent(this, event.key));
    };

    this.onKeyUpHandle = (event: any) => {
      this.props.engine.getEventBus().fireEvent(new KeyUpEvent(this, event.key));
    };

    this.onMouseMoveHandle = (event: MouseEvent) => {
      this.props.engine.getEventBus().fireEvent(new MouseMoveEvent(this, event.clientX, event.clientY));
    };

    this.onMouseDownHandle = (event: MouseEvent) => {
      this.props.engine.getEventBus().fireEvent(new MouseDownEvent(this, event.clientX, event.clientY));
    };

    this.onMouseUpHandle = (event: MouseEvent) => {
      this.props.engine.getEventBus().fireEvent(new MouseUpEvent(this, event.clientX, event.clientY));
    };

    this.onMouseWheelHandle = event => {
      this.props.engine
        .getEventBus()
        .fireEvent(
          new MouseWheelEvent(this, event.clientX, event.clientY, CanvasEventWrapperWidget.normalizeScrollWheel(event))
        );
      event.stopPropagation();
      event.preventDefault();
    };
  }

  static normalizeScrollWheel(event: WheelEvent) {
    let scrollDelta = event.deltaY;
    // check if it is pinch gesture
    if (event.ctrlKey && scrollDelta % 1 !== 0) {
      /*
          Chrome and Firefox sends wheel event with deltaY that
          have fractional part, also `ctrlKey` prop of the event is true
          though ctrl isn't pressed
      */
      return (scrollDelta /= 3);
    }
    return (scrollDelta /= 60);
  }

  componentDidMount() {
    document.addEventListener('mousemove', this.onMouseMoveHandle);
    document.addEventListener('keydown', this.onKeyDownHandle);
    document.addEventListener('keyup', this.onKeyUpHandle);
    this.props.refObject.current.addEventListener('mousedown', this.onMouseDownHandle);
    this.props.refObject.current.addEventListener('mouseup', this.onMouseUpHandle);
    this.props.refObject.current.addEventListener('wheel', this.onMouseWheelHandle);
  }

  componentWillUnmount() {
    document.removeEventListener('mousemove', this.onMouseMoveHandle);
    document.removeEventListener('keyup', this.onKeyUpHandle);
    document.removeEventListener('keydown', this.onKeyDownHandle);
    this.props.refObject.current.removeEventListener('mousedown', this.onMouseDownHandle);
    this.props.refObject.current.removeEventListener('mouseup', this.onMouseUpHandle);
    this.props.refObject.current.removeEventListener('wheel', this.onMouseWheelHandle);
  }

  render() {
    return this.props.children;
  }
}
