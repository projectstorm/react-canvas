import * as _ from "lodash";
import { StateMachine } from "./StateMachine";

export abstract class AbstractState {
	name: string;
	requiredInputs: string[];

	constructor(name: string) {
		this.name = name;
		this.requiredInputs = [];
	}

	requireInput(name: string){
		this.requiredInputs.push(name);
	}

	shouldStateActivate(machine: StateMachine): boolean {
		// now only allow it if all the inputs are matched
		let keys = _.keys(machine.inputs);
		if (_.intersection(keys, this.requiredInputs).length === this.requiredInputs.length) {
			return true;
		}

		return false;
	}

	abstract activated(machine: StateMachine);

	abstract process(machine: StateMachine);

	abstract deactivate(machine: StateMachine);
}
