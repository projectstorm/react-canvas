import { BaseModel, BaseModelListener, DeserializeEvent, Serializable } from "./BaseModel";
import * as _ from "lodash";
import { BaseEvent } from "@projectstorm/react-core";

export interface GraphModelListener<CHILD = BaseModel> extends BaseModelListener {
	modelsAdded?: (event: BaseEvent & { models: CHILD[] }) => any;

	modelsRemoved?: (event: BaseEvent & { models: CHILD[] }) => any;
}

/**
 * Model that supports graph traversal
 */
export class GraphModel<
	CHILD extends BaseModel = BaseModel,
	PARENT extends BaseModel = BaseModel,
	LISTENER extends GraphModelListener<CHILD> = GraphModelListener
> extends BaseModel<PARENT, LISTENER> {
	protected children: { [id: string]: CHILD };
	protected parentDelegate: BaseModel;

	constructor(type: string = "graph") {
		super(type);
		this.children = {};
		this.parentDelegate = this;
	}

	setParentDelegate(parent: BaseModel) {
		this.parentDelegate = parent;
	}

	count(): number {
		return _.values(this.children).length;
	}

	addModels(entities: CHILD[]) {
		_.forEach(entities, entity => {
			this.children[entity.getID()] = entity;
			entity.setParent(this.parentDelegate);
		});
		this.iterateListeners("children added", (listener, event) => {
			if (listener.modelsAdded) {
				listener.modelsAdded({ ...event, models: entities });
			}
		});
	}

	addModel(entity: CHILD) {
		this.addModels([entity]);
	}

	removeModels(entities: CHILD[]) {
		_.forEach(entities, entity => {
			delete this.children[entity.getID()];
			entity.setParent(null);
		});

		this.iterateListeners("children removed", (listener, event) => {
			if (listener.modelsRemoved) {
				listener.modelsRemoved({ ...event, models: entities });
			}
		});
	}

	removeModel(entity: CHILD | string) {
		if (typeof entity === "string") {
			entity = this.getModel(entity);
		}
		this.removeModels([entity]);
	}

	getModel(id: string): CHILD {
		return this.children[id];
	}

	serialize(): Serializable {
		return {
			...super.serialize(),
			entities: _.mapValues(this.children, value => {
				return value.serialize();
			})
		};
	}

	deSerialize(event: DeserializeEvent): void {
		super.deSerialize(event);
		let entities = event.subset("entities");
		this.children = _.mapValues(entities.data, (entity: any, index) => {
			let entityOb = event.engine.generateEntityFor(entity._type);
			entityOb.deSerialize(entities.subset(index));
			return entityOb;
		}) as any;
	}

	getEntities(): { [id: string]: CHILD } {
		return this.children;
	}

	clearEntities() {
		this.removeModels(_.values(this.children));
	}

	getAllEntities(): CHILD[] {
		return _.flatMap(this.children, entity => {
			let arr = [entity];
			if (entity instanceof GraphModel) {
				arr = arr.concat(entity.getAllEntities());
			}
			return arr;
		});
	}
}
