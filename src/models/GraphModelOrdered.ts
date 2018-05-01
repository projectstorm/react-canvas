import { GraphModel, GraphModelListener } from "./GraphModel";
import { BaseModel } from "./BaseModel";
import { CanvasEngine } from "../CanvasEngine";
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

	deSerialize(data: { [p: string]: any }, engine: CanvasEngine, cache: { [p: string]: BaseModel }): void {
		super.deSerialize(data, engine, cache);
		this.entitiesOrdered = _.map(data["entitiesOrdered"], entityID => {
			return this.entities[entityID];
		});
	}

	addEntities(entities: CHILD[]) {
		this.entitiesOrdered = this.entitiesOrdered.concat(entities);
		super.addEntities(entities);
	}

	removeEntities(entities: CHILD[]) {
		for (let i = this.entitiesOrdered.length; i >= 0; i--) {
			let index = this.entitiesOrdered.indexOf(this.entitiesOrdered[i]);
			if (index !== -1) {
				this.entitiesOrdered.splice(index, 1);
			}
		}
		super.removeEntities(entities);
	}

	moveEntityToBack(element: CHILD) {
		let index = this.entitiesOrdered.indexOf(element);
		if (index === -1) {
			return;
		}
		this.entitiesOrdered.splice(0, 0, element);
	}

	moveEntityToFront(element: CHILD) {
		let index = this.entitiesOrdered.indexOf(element);
		if (index === -1) {
			return;
		}
		this.entitiesOrdered.splice(index, 1, element);
	}

	moveEntity(element: CHILD, forward: boolean = true) {
		let index = this.entitiesOrdered.indexOf(element);
		if (index === -1) {
			return;
		}
		this.entitiesOrdered.splice(index, 1);
		this.entitiesOrdered.splice(forward ? index : index - 1, 0, element);
	}
}
