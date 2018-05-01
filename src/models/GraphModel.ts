import { BaseModel, BaseModelListener, Serializable } from "./BaseModel";
import * as _ from "lodash";
import { BaseEvent } from "./BaseObject";
import { CanvasEngine } from "../CanvasEngine";

export interface GraphModelListener<CHILD = BaseModel> extends BaseModelListener {
	modelsAdded: (event: BaseEvent & { models: CHILD[] }) => any;

	modelsRemoved: (event: BaseEvent & { models: CHILD[] }) => any;
}

/**
 * Model that supports graph traversal
 */
export class GraphModel<
	CHILD extends BaseModel,
	PARENT extends BaseModel,
	LISTENER extends GraphModelListener<CHILD> = any
> extends BaseModel<PARENT, LISTENER> {
	protected entities: { [id: string]: CHILD };
	protected parentDelegate: BaseModel;

	constructor(type: string = "graph") {
		super(type);
		this.entities = {};
		this.parentDelegate = this;
	}

	setParentDelegate(parent: BaseModel) {
		this.parentDelegate = parent;
	}

	count(): number {
		return _.values(this.entities).length;
	}

	addEntities(entities: CHILD[]) {
		_.forEach(entities, entity => {
			this.entities[entity.getID()] = entity;
			entity.setParent(this.parentDelegate);
		});
		this.iterateListeners((listener, event) => {
			if (listener.modelsAdded) {
				listener.modelsAdded({ ...event, models: entities });
			}
		});
	}

	removeEntities(entities: CHILD[]) {
		_.forEach(entities, entity => {
			delete this.entities[entity.getID()];
			entity.setParent(null);
		});

		this.iterateListeners((listener, event) => {
			if (listener.modelsRemoved) {
				listener.modelsRemoved({ ...event, models: entities });
			}
		});
	}

	removeEntity(entity: CHILD) {
		this.removeEntities([entity]);
	}

	addEntity(entity: CHILD) {
		this.addEntities([entity]);
	}

	getEntity(id: string): CHILD {
		return this.entities[id];
	}

	serialize(): Serializable {
		return {
			...super.serialize(),
			entities: _.mapValues(this.entities, value => {
				return value.serialize();
			})
		};
	}

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine, cache: { [id: string]: BaseModel }): void {
		super.deSerialize(data, engine, cache);
		this.entities = _.mapValues(data["entities"], (entity: any) => {
			let entityOb = engine.generateEntityFor(entity._type);
			entityOb.deSerialize(entity, engine, cache);
			return entityOb;
		}) as any;
	}

	getEntities(): { [id: string]: CHILD } {
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
