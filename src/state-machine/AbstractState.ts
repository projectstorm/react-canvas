import { StateMachine } from './StateMachine';
import { Action } from '../event-bus/Action';
import { CanvasEngine } from '../CanvasEngine';
import * as _ from 'lodash';

export abstract class AbstractState {
	engine: CanvasEngine;
	name: string;
	requiredInputs: string[];
	actions: Action[];

	constructor(name: string, engine: CanvasEngine) {
		this.engine = engine;
		this.name = name;
		this.requiredInputs = [];
		this.actions = [];
	}

	registerAction(action: Action) {
		this.actions.push(action);
	}

	requireInput(input: string) {
		this.requiredInputs.push(input);
	}

	getName() {
		return this.name;
	}

	shouldStateActivate(machine: StateMachine): boolean {
		let keys = _.keys(machine.inputs);
		if (_.intersection(keys, this.requiredInputs).length === this.requiredInputs.length) {
			return true;
		}

		return false;
	}

	activated(machine: StateMachine) {
		_.forEach(this.actions, action => {
			this.engine.getEventBus().registerAction(action);
		});
	}

	deactivated(machine: StateMachine) {
		_.forEach(this.actions, action => {
			this.engine.getEventBus().unRegisterAction(action);
		});
	}
}
