import { Toolkit } from "../Toolkit";

/**
 * @author Dylan Vorster
 */
export interface BaseEvent<T extends BaseObject = any> {
	source: T;
	stopPropagation: () => any;
	firing: boolean;
	id: string;
	name: string;
}

export interface BaseListener<T extends BaseObject = any> {}

export class BaseObject<LISTENER extends BaseListener = BaseListener> {
	public listeners: { [s: string]: LISTENER };

	constructor() {
		this.listeners = {};
	}

	public iterateListeners(name: string, cb: (t: LISTENER, event: BaseEvent) => any) {
		let event: BaseEvent = {
			id: Toolkit.UID(),
			firing: true,
			source: this,
			name: name,
			stopPropagation: () => {
				event.firing = false;
			}
		};

		for (let i in this.listeners) {
			if (this.listeners.hasOwnProperty(i)) {
				// propagation stopped
				if (!event.firing) {
					return;
				}
				cb(this.listeners[i], event);
			}
		}
		return event;
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
