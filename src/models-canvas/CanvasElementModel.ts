import { CanvasLayerModel } from "./CanvasLayerModel";
import { BaseModel, DeserializeEvent } from "../models/BaseModel";
import { Rectangle } from "../geometry/Rectangle";
import { BaseEvent, BaseListener } from "../models/BaseObject";
import { CanvasEngine } from "../CanvasEngine";

export interface CanvasElementModelListener<T extends CanvasElementModel = any> extends BaseListener<T> {
	selectionChanged(event: BaseEvent & { selected: boolean });

	lockChanged(event: BaseEvent & { locked: boolean });
}

export abstract class CanvasElementModel<
	T extends CanvasElementModelListener = CanvasElementModelListener
> extends BaseModel<CanvasLayerModel, CanvasElementModelListener> {
	protected selected: boolean;
	protected locked: boolean;

	constructor(type: string) {
		super(type);
		this.type = type;
		this.selected = false;
		this.locked = false;
	}

	serialize() {
		return {
			...super.serialize(),
			selected: this.selected,
			locked: this.locked
		};
	}

	deSerialize(event: DeserializeEvent): void {
		super.deSerialize(event);
		this.selected = !!event.data["selected"];
		this.locked = !!event.data["locked"];
	}

	setSelected(selected: boolean) {
		this.selected = selected;
		this.iterateListeners("selection changed", (listener, event: any) => {
			if (listener.selectionChanged) {
				event.selected = selected;
				listener.selectionChanged(event);
			}
		});
	}

	setLocked(locked: boolean) {
		this.locked = locked;
		this.iterateListeners("lock changed", (listener, event: any) => {
			if (listener.lockChanged) {
				event.locked = locked;
				listener.lockChanged(event);
			}
		});
	}

	isSelected(): boolean {
		return this.selected;
	}

	isLocked(): boolean {
		return this.getParent().isLocked();
	}

	abstract getDimensions(): Rectangle;

	abstract setDimensions(dimensions: Rectangle);

	moveToLayer(layer: CanvasLayerModel) {
		if (this.parent) {
			this.parent.removeEntity(this);
		}
		layer.addEntity(this);
	}

	moveToFront() {
		this.parent.moveEntityToFront(this);
	}

	moveToBack() {
		this.parent.moveEntityToBack(this);
	}

	moveForward() {
		this.parent.moveEntity(this, true);
	}

	moveBackward() {
		this.parent.moveEntity(this, false);
	}
}
