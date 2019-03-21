import { AbstractState } from './AbstractState';
import * as _ from 'lodash';
import { AbstractStateMachineInput } from './AbstractStateMachineInput';
import { BaseEvent, BaseListener, BaseObject } from '@projectstorm/react-core';

export interface StateMachineListener extends BaseListener<StateMachine> {
	stateChanged(event: BaseEvent<StateMachine> & { state: AbstractState });
}

export class StateMachine extends BaseObject<StateMachineListener> {
	inputs: { [name: string]: AbstractStateMachineInput };
	states: { [name: string]: AbstractState };
	state: AbstractState;

	constructor() {
		super();
		this.inputs = {};
		this.states = {};
		this.state = null;
	}

	addState(state: AbstractState) {
		if (this.states[state.getName()]) {
			throw 'A state with name: ' + state.getName() + ' is already registered';
		}
		this.states[state.getName()] = state;
	}

	removeInput(type: string, fire: boolean = true) {
		if (!this.inputs[type]) {
			return;
		}

		delete this.inputs[type];
		if (fire) {
			this.process();
		}
	}

	addInput(input: AbstractStateMachineInput, fire: boolean = true): AbstractStateMachineInput {
		this.inputs[input.name] = input;
		if (fire) {
			this.process();
		}
		return input;
	}

	getInput(name: string): AbstractStateMachineInput {
		return _.find(this.inputs, { name: name });
	}

	clearState() {
		if (this.state) {
			this.state.deactivated(this);
		} else {
			return;
		}
		this.state = null;
		this.fireStateChanged();
	}

	fireStateChanged() {
		this.iterateListeners('state changed', (listener, event) => {
			if (listener.stateChanged) {
				listener.stateChanged({ ...event, state: this.state });
			}
		});
	}

	setState(state: AbstractState) {
		// deactivate previous state
		if (this.state && state) {
			if (this.state.name !== state.name) {
				this.state.deactivated(this);
				this.state = state;
				state.activated(this);
				this.fireStateChanged();
			}
		} else {
			// there never was a state
			this.state = state;
			state.activated(this);
			this.fireStateChanged();
		}
	}

	process() {
		// check for possible reactions to current inputs
		let possibleReactions = _.map(
			_.filter(this.states, state => {
				return state.shouldStateActivate(this);
			}),
			state => {
				return state.getName();
			}
		);

		if (possibleReactions.length === 0) {
			this.clearState();
		} else if (possibleReactions.length > 0) {
			this.setState(this.states[possibleReactions[0]]);
		}
	}
}
