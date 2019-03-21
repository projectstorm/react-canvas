import { Action } from './Action';
import { Event } from './Event';
import * as _ from 'lodash';
import { BaseEvent, BaseListener, BaseObject } from '@projectstorm/react-core';

export interface EventBusListener extends BaseListener {
	eventWillFire?: (event: BaseEvent & { event: Event }) => any;
	eventDidFire?: (event: BaseEvent & { event: Event }) => any;
}

export class EventBus extends BaseObject<EventBusListener> {
	actions: {
		[targetEvent: string]: {
			[id: string]: Action;
		};
	};

	constructor() {
		super();
		this.actions = {};
	}

	unRegisterAction(action: Action) {
		if (!this.actions[action.targetEvent]) {
			return;
		}

		if (!this.actions[action.targetEvent][action.id]) {
			return;
		}

		delete this.actions[action.targetEvent][action.id];

		if (_.keys(this.actions[action.targetEvent]).length === 0) {
			delete this.actions[action.targetEvent];
		}
	}

	registerAction(action: Action): Action {
		if (!this.actions[action.targetEvent]) {
			this.actions[action.targetEvent] = {};
		}
		this.actions[action.targetEvent][action.id] = action;
		return action;
	}

	fireEvent(event: Event) {
		if (!this.actions[event.name]) {
			return;
		}

		// before the event fires
		this.iterateListeners('event will fire', (listener, baseEvent) => {
			if (listener.eventWillFire) {
				listener.eventWillFire({
					...baseEvent,
					event: event
				});
			}
		});

		let processedActions = {};
		do {
			_.some(this.actions[event.name], action => {
				if (event.stopped) {
					return true;
				}
				processedActions[action.id] = action;
				event.fire(action);
			});
		} while (!event.stopped && _.keys(this.actions[event.name]).length !== _.keys(processedActions).length);

		if (event.actionsFired.length > 0) {
			this.iterateListeners('event did fire', (listener, baseEvent) => {
				if (listener.eventDidFire) {
					listener.eventDidFire({
						...baseEvent,
						event: event
					});
				}
			});
		}
	}
}
