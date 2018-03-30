import { Toolkit } from "../Toolkit";

export class Model {
	protected id: string;

	constructor() {
		this.id = Toolkit.UID();
	}

	getID() {
		return this.id;
	}
}
