import { BaseEvent, BaseListener, BaseModel } from "./BaseModel";
import * as _ from "lodash";

export interface GraphModelListener<CHILD = BaseModel> extends BaseListener {
	modelAdded: (event: BaseEvent & { model: CHILD }) => any;

	modelRemoved: (event: BaseEvent & { model: CHILD }) => any;
}

/**
 * Model that supports graph traversal
 */
export class GraphModel<
	CHILD extends BaseModel,
	PARENT = any,
	LISTENER extends GraphModelListener<CHILD> = any
> extends BaseModel<PARENT, LISTENER> {
	protected entities: { [id: string]: CHILD };

	constructor() {
		super();
		this.entities = {};
	}

	addEntity(entity: CHILD) {
		this.entities[entity.getID()] = entity;
		entity.setParent(this);
		this.iterateListeners((listener, event) => {
			if (listener.modelAdded) {
				listener.modelAdded({ ...event, model: entity });
			}
		});
	}

	removeEntity(entity: CHILD) {
		delete this.entities[entity.getID()];
		entity.setParent(null);
		this.iterateListeners((listener, event) => {
			if (listener.modelRemoved) {
				listener.modelRemoved({ ...event, model: entity });
			}
		});
	}

	getEntities() {
		return this.entities;
	}

	clearEntities() {
		this.entities = {};
	}

	getAllEntities(): CHILD[] {
		return _.flatMap(this.entities, entity => {
			let arr = [entity];
			if (entity instanceof GraphModel) {
				arr = arr.concat(entity.getAllEntities());
			}
			return arr;
		});
	}
}
