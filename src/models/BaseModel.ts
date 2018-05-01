import { BaseEvent, BaseListener, BaseObject } from "./BaseObject";
import { Toolkit } from "../Toolkit";
import { CanvasEngine } from "../CanvasEngine";

export interface Serializable {
	_type: string;
	id: string;
}

export interface BaseModelListener<T extends BaseModel = BaseModel> extends BaseListener<T> {
	lockChanged?(event: BaseEvent & { locked: boolean });
	delegateEvent?(event: BaseEvent);
}

export class BaseModel<
	PARENT extends BaseModel<any, BaseModelListener> = any,
	LISTENER extends BaseModelListener = BaseListener
> extends BaseObject<LISTENER> {
	protected parent: PARENT;
	protected id: string;
	protected type: string;
	protected locked: boolean;

	constructor(type: string) {
		super();
		this.id = Toolkit.UID();
		this.type = type;
	}

	isLocked(): boolean {
		return this.locked || (this.parent && this.parent.isLocked());
	}

	setParent(parent: PARENT) {
		this.parent = parent;
	}

	getType(): string {
		return this.type;
	}

	getParent(): PARENT {
		return this.parent;
	}

	public clearListeners() {
		this.listeners = {};
	}

	iterateListeners(cb: (t: LISTENER, event: BaseEvent) => any) {
		// optionally delegate the event up the stack so the event bus can grab it
		if (this.parent) {
			this.parent.iterateListeners((listener, event) => {
				if (listener.delegateEvent) {
					listener.delegateEvent(event);
				}
			});
		}
		return super.iterateListeners(cb);
	}

	public deSerialize(data: { [s: string]: any }, engine: CanvasEngine, cache: { [id: string]: BaseModel }) {
		this.id = data.id;
		this.locked = !!data.locked;
		if (data["parent"]) {
			if (!cache[data["parent"]]) {
				throw "Cannot deserialize, because of missing parent";
			}
			this.parent = cache[data["parent"]] as any;
		}
		cache[this.id] = this;
	}

	public serialize(): Serializable & any {
		return {
			_type: this.type,
			id: this.id,
			parent: this.parent && this.parent.id,
			locked: this.locked
		};
	}

	public getID() {
		return this.id;
	}
}
