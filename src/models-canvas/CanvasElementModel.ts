import { CanvasLayerModel } from "./CanvasLayerModel";
import { BaseModel } from "../models/BaseModel";
import { Rectangle } from "../geometry/Rectangle";
import {BaseEvent, BaseListener} from "../models/BaseObject";
import {CanvasEngine} from "../CanvasEngine";

export interface CanvasElementModelListener extends BaseListener<CanvasElementModel> {
	selectionChanged(event: BaseEvent & { selected: boolean });
}

export abstract class CanvasElementModel extends BaseModel<CanvasLayerModel, CanvasElementModelListener> {
	selected: boolean;
	type: string;

	constructor(type: string) {
		super(type);
		this.type = type;
		this.selected = false;
	}

	serialize(){
		return {
			...super.serialize(),
			type: this.type,
			selected: this.selected
		};
	}

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine): void {
		super.deSerialize(data, engine);
		this.type = data['type'];
		this.selected = data['selected'];
	}

	setSelected(selected: boolean) {
		this.selected = selected;
		this.iterateListeners((listener, event: any) => {
			if (listener.selectionChanged) {
				event.selected = selected;
				listener.selectionChanged(event);
			}
		});
	}

	abstract getDimensions(): Rectangle;

	abstract setDimensions(dimensions: Rectangle);

	moveToLayer(layer: CanvasLayerModel) {
		if (this.parent) {
			this.parent.removeElement(this);
		}
		layer.addElement(this);
	}

	moveToFront() {
		this.parent.moveElementToFront(this);
	}

	moveToBack() {
		this.parent.moveElementToBack(this);
	}

	moveForward() {
		this.parent.moveElement(this, true);
	}

	moveBackward() {
		this.parent.moveElement(this, false);
	}
}
