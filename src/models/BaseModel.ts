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
	protected serializeType: string;

	constructor(type: string) {
		super();
		this.id = Toolkit.UID();
		this.serializeType = type;
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

	public deSerialize(data: { [s: string]: any }, engine: CanvasEngine) {
		this.id = data.id;
	}

	public serialize(): Serializable & any {
		return {
			id: this.id,
			_type: this.serializeType
		};
	}

	public getID() {
		return this.id;
	}
}
