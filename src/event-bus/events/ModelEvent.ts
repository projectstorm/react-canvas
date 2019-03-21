import { Event } from '../Event';
import { BaseEvent } from '@projectstorm/react-core';

export class ModelEvent extends Event {
	modelEvent: BaseEvent;

	static NAME = 'model-delegate-event';

	constructor(modelEvent: BaseEvent) {
		super(ModelEvent.NAME, modelEvent.source);
		this.modelEvent = modelEvent;
	}
}
