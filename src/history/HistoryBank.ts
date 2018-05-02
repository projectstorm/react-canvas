import * as _ from "lodash";
import { BaseEvent, BaseListener, BaseObject } from "../base-models/BaseObject";
import { HistoryState } from "./HistoryState";

export interface HistoryBankListener extends BaseListener<HistoryBank> {
	forward?(event: BaseEvent<HistoryBank> & { state: HistoryState });

	backward?(event: BaseEvent<HistoryBank> & { state: HistoryState });
}

export class HistoryBank extends BaseObject<HistoryBankListener> {
	history: HistoryState[];
	pointer: number;

	constructor() {
		super();
		this.history = [];
		this.pointer = 0;
	}

	pushState(state: HistoryState) {
		// state is equal, ignore pushing it
		if (_.isEqual(this.history[this.pointer], state)) {
			return;
		}

		this.pointer++;
		this.history.splice(this.pointer);
		this.history.push(state);
	}

	goForward() {
		// cant go anymore forward
		if (this.pointer === this.history.length - 1) {
			return;
		}
		this.pointer++;
		this.iterateListeners("history moved forward", (listener, event) => {
			if (listener.forward) {
				listener.forward({ ...event, state: this.history[this.pointer] });
			}
		});
	}

	goBackward() {
		// cant go anymore backward
		if (this.pointer <= 0) {
			return;
		}
		this.pointer--;
		this.iterateListeners("history moved backward", (listener, event) => {
			if (listener.backward) {
				listener.backward({ ...event, state: this.history[this.pointer] });
			}
		});
	}
}
