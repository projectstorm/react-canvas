import { Toolkit } from "../Toolkit";

/**
 * @author Dylan Vorster
 */
export interface BaseEvent<T extends BaseObject = any> {
	source: BaseObject<BaseListener>;
	stopPropagation: () => any;
	firing: boolean;
	id: string;
}

export interface BaseListener<T extends BaseObject = any> {}

export class BaseObject<LISTENER extends BaseListener = BaseListener> {
	public listeners: { [s: string]: LISTENER };

	constructor() {
		this.listeners = {};
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
