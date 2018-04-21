import {AbstractState} from "./AbstractState";
import * as _ from "lodash";
import {AbstractStateMachineInput} from "./input/AbstractStateMachineInput";
import {StateMachineReducer} from "./StateMachineReducer";
import {BaseEvent, BaseListener, BaseObject} from "../models/BaseObject";

export interface StateMachineListener extends BaseListener<StateMachine> {
	stateChanged(event: BaseEvent<StateMachine> & {state: AbstractState});
}

export class StateMachine extends BaseObject<StateMachineListener>{
	inputs: { [name: string]: AbstractStateMachineInput };
	states: { [name: string]: AbstractState };
	state: AbstractState;
	reducers: StateMachineReducer[];

	constructor() {
		super();
		this.inputs = {};
		this.states = {};
		this.state = null;
		this.reducers = [];
	}

	addReducer(reducer: StateMachineReducer) {
		this.reducers.push(reducer);
	}

	addState(state: AbstractState) {
		if (this.states[state.name]) {
			throw "A state with name: " + state.name + " is already registered";
		}
		this.states[state.name] = state;
	}

	removeInput(type: string, fire: boolean = true) {
		if (!this.inputs[type]) {
			return;
		}

		delete this.inputs[type];
		if(fire){
			this.process();
		}
	}

	addInput(input: AbstractStateMachineInput, fire: boolean = true): AbstractStateMachineInput {
		this.inputs[input.name] = input;
		if(fire){
			this.process();
		}
		return input;
	}

	getInput(name: string): AbstractStateMachineInput {
		return _.find(this.inputs, {name: name});
	}

	clearState() {
		if (this.state) {
			this.state.deactivate(this);
		} else {
			return;
		}
		this.state = null;
		this.fireStateChanged();
	}

	fireStateChanged(){
		this.iterateListeners((listener, event) => {
			if(listener.stateChanged){
				listener.stateChanged({...event, state: this.state});
			}
		})
	}

	setState(state: AbstractState) {
		// deactivate previous state
		if (this.state && state) {
			if (this.state.name !== state.name) {
				this.state.deactivate(this);
				this.state = state;
				state.activated(this);
				this.fireStateChanged();
			} else {
				this.state = state;
				state.process(this);
			}
		} else {
			// there never was a state
			this.state = state;
			state.activated(this);
			this.fireStateChanged();
		}
	}

	process() {
		// check states
		let possibleStates = [];
		_.forEach(this.states, state => {
			if (state.shouldStateActivate(this)) {
				possibleStates.push(state.name);
			}
		});

		//run through the reducers to try and get 1 back
		if (possibleStates.length > 1) {
			for (let reducer of this.reducers) {
				let foundStates: string[] = _.intersection(possibleStates, reducer.states);
				if (foundStates.length > 0) {
					possibleStates = _.pullAll(possibleStates, foundStates);
					let reduced = reducer.reduce(foundStates);
					possibleStates.push(reduced);
				}
			}
		}


		if (possibleStates.length === 0) {
			this.clearState();
		} else if (possibleStates.length > 0) {
			this.setState(this.states[possibleStates[0]]);
		}


		// cleanup inputs
		_.forEach(this.inputs, input => {
			if (input.autoEject) {
				delete this.inputs[input.name];
			}
		});
	}
}
