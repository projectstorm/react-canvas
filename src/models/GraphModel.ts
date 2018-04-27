import { BaseModel, Serializable } from "./BaseModel";
import * as _ from "lodash";
import { BaseEvent, BaseListener } from "./BaseObject";
import { CanvasEngine } from "../CanvasEngine";

export interface GraphModelListener<CHILD = BaseModel> extends BaseListener {
	modelAdded: (event: BaseEvent & { model: CHILD }) => any;

	modelRemoved: (event: BaseEvent & { model: CHILD }) => any;
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

	constructor(type: string) {
		super(type);
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
