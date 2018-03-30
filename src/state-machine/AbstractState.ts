import * as _ from "lodash";
import { StateMachine } from "./StateMachine";

export abstract class AbstractState {
	name: string;
	inputsRequired: string[];

	constructor(name: string, inputsRequired: string[] = []) {
		this.name = name;
		this.inputsRequired = inputsRequired;
	}

	shouldStateActivate(machine: StateMachine): boolean {
		return _.intersection(_.keys(machine.inputs), this.inputsRequired).length === this.inputsRequired.length;
	}

	abstract activated(machine: StateMachine);

	abstract process(machine: StateMachine);

	abstract deactivate(machine: StateMachine);
}
