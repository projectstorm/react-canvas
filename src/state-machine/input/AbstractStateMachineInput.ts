export class AbstractStateMachineInput {
	name: string;
	autoEject: boolean;

	constructor(name: string) {
		this.name = name;
		this.autoEject = false;
	}
}
