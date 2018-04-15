import * as _ from "lodash";
import { StateMachine } from "./StateMachine";

export abstract class AbstractState {
	name: string;
	requiredPreviousState: string;

	_whitelist: string[];
	_blacklist: string[];

	constructor(name: string) {
		this.name = name;
		this.requiredPreviousState = null;
		this._whitelist = [];
		this._blacklist = [];
	}

	whitelist(input: string) {
		this._whitelist.push(input);
	}

	shouldStateActivate(machine: StateMachine): boolean {
		// a previous state is required
		if(this.requiredPreviousState){

			// a previous state was required but there was none
			if(!machine.state){
				return false;
			}

			if(machine.state.name !== this.requiredPreviousState){
				return false;
			}
		}

		// now only allow it if all the inputs are matched
		let keys = _.keys(machine.inputs);
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
