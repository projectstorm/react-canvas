import { GraphModel, GraphModelListener } from "./GraphModel";
import { BaseModel, DeserializeEvent } from "./BaseModel";
import * as _ from "lodash";

export class GraphModelOrdered<
	CHILD extends BaseModel,
	PARENT extends BaseModel,
	LISTENER extends GraphModelListener<CHILD> = any
> extends GraphModel<CHILD, PARENT, LISTENER> {
	protected entitiesOrdered: CHILD[];

	constructor(type: string = "graph") {
		super(type);
		this.entitiesOrdered = [];
	}

	getArray(): CHILD[] {
		return this.entitiesOrdered;
	}

	serialize() {
		return {
			...super.serialize(),
			entitiesOrdered: _.map(this.entitiesOrdered, entity => {
				return entity.getID();
			})
		};
	}

	deSerialize(event: DeserializeEvent): void {
		super.deSerialize(event);
		this.entitiesOrdered = _.map(event.data["entitiesOrdered"], entityID => {
			return this.children[entityID];
		});
	}

	addModels(entities: CHILD[], position?: number) {
		super.addModels(entities);
		if (position == null) {
			this.entitiesOrdered = this.entitiesOrdered.concat(entities);
		} else {
			this.entitiesOrdered.splice(position, 0, ...entities);
		}
	}

	addModel(entity: CHILD, position?: number) {
		this.addModels([entity], position);
	}

	removeModels(entities: CHILD[]) {
		for (let i = this.entitiesOrdered.length; i >= 0; i--) {
			let index = this.entitiesOrdered.indexOf(this.entitiesOrdered[i]);
			if (index !== -1) {
				this.entitiesOrdered.splice(index, 1);
			}
		}
		super.removeModels(entities);
	}

	moveModelToBack(element: CHILD) {
		let index = this.entitiesOrdered.indexOf(element);
		if (index === -1) {
			return;
		}
		this.entitiesOrdered.splice(0, 0, element);
	}

	moveModelToFront(element: CHILD) {
		let index = this.entitiesOrdered.indexOf(element);
		if (index === -1) {
			return;
		}
		this.entitiesOrdered.splice(index, 1);
		this.entitiesOrdered.push(element);
	}

	moveModel(element: CHILD, newIndex: number) {
		let index = this.entitiesOrdered.indexOf(element);
		if (index === -1) {
			return;
		}
		this.entitiesOrdered.splice(index, 1);
		this.entitiesOrdered.splice(newIndex, 0, element);
	}
}
