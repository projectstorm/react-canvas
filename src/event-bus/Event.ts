import { Action } from './Action';

export class Event {
	stopped: boolean;
	source: any;
	name: string;
	actionsFired: Action[];

	constructor(name: string, source: any) {
		this.name = name;
		this.source = source;
		this.stopped = false;
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
