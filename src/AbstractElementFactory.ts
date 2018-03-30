import { CanvasElementModel } from "./models-canvas/CanvasElementModel";
import { CanvasEngine } from "./CanvasEngine";
import { AbstractState } from "./state-machine/AbstractState";

export abstract class AbstractElementFactory<T extends CanvasElementModel = CanvasElementModel> {
	public type: string;
	protected directiveProcessors;
	protected engine: CanvasEngine;

	constructor(type: string) {
		this.type = type;
		this.directiveProcessors = [];
	}

	setEngine(engine: CanvasEngine) {
		this.engine = engine;
	}

	// getBoundDirectives(dimension: Dimension, x: number, y: number, threshold: number = 5) {
	//     //check for top corners
	//
	//     //check sides
	//     if (y > dimension.getTop() && y < dimension.getBottom()) {
	//         // left border
	//         if (dimension.getLeft() - threshold <= x && dimension.getLeft() + threshold >= x) {
	//             return new ResizeDirective();
	//         }
	//         // right border
	//         else if (dimension.getRight() - threshold <= x && dimension.getRight() + threshold >= x) {
	//             return new ResizeDirective();
	//         }
	//     }else if(x > dimension.getLeft() && x < dimension.getRight()){
	//         // top border
	//         if (dimension.getTop() - threshold <= y && dimension.getTop() + threshold >= y) {
	//             return new ResizeDirective();
	//         }
	//         // bottom border
	//         else if (dimension.getBottom() - threshold <= y && dimension.getBottom() + threshold >= y) {
	//             return new ResizeDirective();
	//         }
	//     }
	// }

	getCanvasStates(): AbstractState[] {
		return [];
	}

	abstract generateModel(): T;

	abstract generateWidget(engine: CanvasEngine, model: T): JSX.Element;
}
