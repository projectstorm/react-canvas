import { Toolkit } from "../Toolkit";
import { Action } from "./Action";

export class Event {
	stopped: boolean;
	id: string;
	source: any;
	name: string;
	actionsFired: Action[];

	constructor(name: string, source: any) {
		this.name = name;
		this.source = source;
		this.stopped = false;
		this.id = Toolkit.UID();
		this.actionsFired = [];
	}

	fire(action: Action) {
		action.doAction(this);
		this.actionsFired.push(action);
	}

	stopPropagation() {
		this.stopped = true;
	}
}
