import { CanvasLayerModel } from "./CanvasLayerModel";
import { Rectangle } from "../geometry/Rectangle";
import { BaseEvent } from "../base-models/BaseObject";
import { BaseModel, BaseModelListener, DeserializeEvent } from "../base-models/BaseModel";

export interface CanvasElementModelListener<T extends CanvasElementModel = any> extends BaseModelListener<T> {
	selectionChanged?(event: BaseEvent<CanvasElementModel> & { selected: boolean });

	lockChanged?(event: BaseEvent<CanvasElementModel> & { locked: boolean });
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
			this.parent.removeModel(this);
		}
		layer.addModel(this);
	}

	moveToFront() {
		this.parent.moveModelToFront(this);
	}

	moveToBack() {
		this.parent.moveModelToBack(this);
	}

	moveTo(index: number) {
		this.parent.moveModel(this, index);
	}
}
