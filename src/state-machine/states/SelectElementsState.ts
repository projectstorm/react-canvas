import {AbstractState} from "../AbstractState";
import {StateMachine} from "../StateMachine";
import {CanvasEngine} from "../../CanvasEngine";
import {MouseDownInput} from "../input/MouseDownInput";
import {ModelElementInput} from "../input/ModelElementInput";
import {KeyCode, KeyInput} from "../input/KeyInput";

export class SelectElementsState extends AbstractState{

	engine: CanvasEngine;

	static NAME = 'select-elements';

	constructor(engine: CanvasEngine){
		super(SelectElementsState.NAME);
		this.requireInput(MouseDownInput.NAME);
		this.requireInput(ModelElementInput.NAME);
		this.requireInput(KeyInput.identifier(KeyCode.SHIFT));
		this.engine = engine;
	}

	activated(machine: StateMachine) {
		let input = machine.getInput(ModelElementInput.NAME) as ModelElementInput;
		input.element.setSelected(true);
		this.engine.getCanvasWidget().forceUpdate();
	}

	deactivate(machine: StateMachine) {
	}

	process(machine: StateMachine) {
	}

}
