export class StateMachineInput {
	name: string;
	claimed: boolean;
	fallthrough: boolean;

	constructor(name: string) {
		this.name = name;
		this.claimed = false;
		this.fallthrough = true;
	}

	claim() {
		this.claimed = true;
	}
}
