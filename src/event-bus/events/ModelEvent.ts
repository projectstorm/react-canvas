import { Event } from "../Event";
import { BaseEvent } from "../../models/BaseObject";

export class ModelEvent extends Event {
	modelEvent: BaseEvent;

	constructor(modelEvent: BaseEvent) {
		super("model-event", modelEvent.source);
		this.modelEvent = modelEvent;
	}
}
