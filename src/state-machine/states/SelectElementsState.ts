import { AbstractState } from "../AbstractState";
import { CanvasEngine } from "../../CanvasEngine";
import { KeyCode, KeyInput } from "../input/KeyInput";
import { SelectElementAction } from "../../event-bus/actions/SelectElementAction";

export class SelectElementsState extends AbstractState {
	constructor(engine: CanvasEngine) {
		super("select-elements", engine);
		this.requireInput(KeyInput.identifier(KeyCode.SHIFT));
		this.registerAction(new SelectElementAction(engine, true));
	}
}
