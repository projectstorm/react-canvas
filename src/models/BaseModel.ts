import { Toolkit } from "../Toolkit";
import * as _ from "lodash";
import { Model } from "./Model";

/**
 * @author Dylan Vorster
 */
export interface BaseEvent<T extends BaseModel = any> {
	source: BaseModel<BaseListener>;
	stopPropagation: () => any;
	firing: boolean;
	id: string;
}

export interface BaseListener<T extends BaseModel = any> {}

export class BaseModel<PARENT = any, LISTENER extends BaseListener = BaseListener> extends Model {
	public listeners: { [s: string]: LISTENER };
	protected parent: any;

	constructor() {
		super();
		this.listeners = {};
	}

	setParent(parent: PARENT) {
		this.parent = parent;
	}

	getParent(): PARENT {
		return this.parent;
	}

	public clearListeners() {
		this.listeners = {};
	}

	public deSerialize(data: { [s: string]: any }) {
		this.id = data.id;
	}

	public serialize() {
		return {
			id: this.id
		};
	}

	public iterateListeners(cb: (t: LISTENER, event: BaseEvent) => any) {
		let event: BaseEvent = {
			id: Toolkit.UID(),
			firing: true,
			source: this,
			stopPropagation: () => {
				event.firing = false;
			}
		};

		for (var i in this.listeners) {
			if (this.listeners.hasOwnProperty(i)) {
				// propagation stopped
				if (!event.firing) {
					return;
				}
				cb(this.listeners[i], event);
			}
		}
	}

	public removeListener(listener: string) {
		if (this.listeners[listener]) {
			delete this.listeners[listener];
			return true;
		}
		return false;
	}

	public addListener(listener: LISTENER): string {
		let uid = Toolkit.UID();
		this.listeners[uid] = listener;
		return uid;
	}
}
