import * as _ from "lodash";
import { StateMachine } from "./StateMachine";

export abstract class AbstractState {
	name: string;

	_whitelist: string[];
	_blacklist: string[];

	constructor(name: string) {
		this.name = name;
		this._whitelist = [];
		this._blacklist = [];
	}

	whitelist(input: string) {
		this._whitelist.push(input);
	}

	blacklist(input: string) {
		this._blacklist.push(input);
	}

	shouldStateActivate(machine: StateMachine): boolean {
		let keys = _.keys(machine.inputs);

		if (_.intersection(keys, this._blacklist).length > 0) {
			return false;
		}

		if (_.intersection(keys, this._whitelist).length === this._whitelist.length) {
			_.forEach(this._whitelist, input => {
				machine.getInput(input).claim();
			});
			return true;
		}

		return false;
	}

	abstract activated(machine: StateMachine);

	abstract process(machine: StateMachine);

	abstract deactivate(machine: StateMachine);
}
