import { AbstractStateMachineInput } from "../input/AbstractStateMachineInput";

export class AbstractStateMachineEventInput extends AbstractStateMachineInput {
	constructor(name: string) {
		super(name);
		this.autoEject = true;
	}
}
