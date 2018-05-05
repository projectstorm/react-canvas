import * as React from "react";

export interface MouseWidgetProps {
	element: string;
	mouseUpEvent: (event) => any;
	mouseDownEvent: (event) => any;
	extraProps: any;
}

export interface MouseWidgetState {}

export class MouseWidget extends React.Component<MouseWidgetProps, MouseWidgetState> {
	cb: any;

	constructor(props: MouseWidgetProps) {
		super(props);
		this.state = {};
		this.cb = null;
	}

	componentWillUnmount() {
		if (this.cb) {
			this.props.mouseUpEvent(null);
			window.removeEventListener("mouseup", this.cb);
		}
	}

	render() {
		return React.createElement(
			this.props.element,
			Object.assign(
				{
					onMouseDown: event => {
						this.cb = event2 => {
							if (this.cb) {
								window.removeEventListener("mouseup", this.cb);
							}
							this.props.mouseUpEvent(event2);
						};
						window.addEventListener("mouseup", this.cb);
						this.props.mouseDownEvent(event);
					}
				},
				this.props.extraProps || {}
			) as any,
			this.props.children
		);
	}
}
