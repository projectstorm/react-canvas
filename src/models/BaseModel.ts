import {BaseListener, BaseObject} from "./BaseObject";
import {Toolkit} from "../Toolkit";
import {CanvasEngine} from "../CanvasEngine";

export interface Serializable {
	_type: string;
	id: string;
}

export class BaseModel<PARENT = any, LISTENER extends BaseListener = BaseListener> extends BaseObject<LISTENER> {
	protected parent: any;
	protected id: string;
	public type: string;

	constructor(type: string) {
		super();
		this.id = Toolkit.UID();
		this.type = type;
	}

	setParent(parent: PARENT) {
		this.parent = parent;
	}

	getParent(): PARENT {
		return this.parent;
	}

	public clearListeners() {
		this.listeners = {};
	}

	public deSerialize(data: { [s: string]: any }, engine: CanvasEngine, cache: {[id: string]: BaseModel}) {
		this.id = data.id;
		if(data['parent']){
			if(!cache[data['parent']]){
				throw "Cannot deserialize, because of missing parent";
			}
			this.parent = cache[data['parent']];
		}
		cache[this.id] = this;
	}

	public serialize(): Serializable & any {
		return {
			id: this.id,
			parent: this.parent && this.parent.id,
			_type: this.type
		};
	}

	public getID() {
		return this.id;
	}
}
