import { CanvasElementModel } from "../../models-canvas/CanvasElementModel";
import { Rectangle } from "../../geometry/Rectangle";

export class PaperElementModel extends CanvasElementModel {
	dimensions: Rectangle;

	protected width: number;
	protected height: number;
	protected dpi: number;

	static INCH = 25.4; //mm

	constructor() {
		super("paper");
		this.dimensions = new Rectangle();
		this.setA4();
	}

	setA4() {
		this.updateDimensions(210, 297, 300);
	}

	updateDimensions(width: number, height: number, dpi: number) {
		this.width = width;
		this.height = height;
		this.dpi = dpi;
		this.recomputeDimensions();
	}

	recomputeDimensions() {
		this.dimensions = new Rectangle(
			0,
			0,
			this.width * this.dpi / PaperElementModel.INCH,
			this.height * this.dpi / PaperElementModel.INCH
		);
	}

	getDimensions(): Rectangle {
		return this.dimensions;
	}

	setDimensions(dimensions: Rectangle) {}
}
