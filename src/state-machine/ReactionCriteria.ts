import { StateMachine } from "./StateMachine";

export abstract class ReactionCriteria {
	abstract matches(machine: StateMachine): boolean;

	abstract postReaction(machine: StateMachine);
}
