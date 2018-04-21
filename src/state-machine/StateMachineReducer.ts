export class StateMachineReducer {
	states: string[];

	constructor(states: string[]) {
		this.states = states;
	}

	reduce(states: string[]): string {
		for (let state of this.states) {
			if (states.indexOf(state) !== -1) {
				return state;
			}
		}
	}
}
