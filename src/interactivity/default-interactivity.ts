import {LayerModel} from "../primitives-core/layer/LayerModel";
import {InlineAction} from "../event-bus/InlineAction";
import {ModelEvent} from "../event-bus/events/ModelEvent";
import * as _ from "lodash";
import {SelectionElementModel} from "../primitives/selection/SelectionElementModel";
import {CanvasEngine} from "../CanvasEngine";

export const installDefaultInteractivity = (engine: CanvasEngine) => {
  // selection layer
  let selectionLayer = new LayerModel();
  selectionLayer.setSVG(false);
  selectionLayer.setTransformable(false);

  // listen for a new model
  engine.addListener({
    modelChanged: event => {
      if (event.oldModel) {
        event.oldModel.removeLayer(selectionLayer);
      }
      if (event.model) {
        event.model.addLayer(selectionLayer);
      }
    }
  });

  engine.getEventBus().registerAction(
    new InlineAction(ModelEvent.NAME, (event: ModelEvent) => {
      // setup a combo box for when there are models
      if (event.modelEvent.name === 'selection changed') {
        selectionLayer.clearEntities();
        engine.getModel().layers.moveModelToFront(selectionLayer);
        let selected = _.filter(engine.getModel().getElements(), element => {
          return element.isSelected();
        });
        if (selected.length > 0) {
          let model = new SelectionElementModel();
          model.setModels(selected);
          selectionLayer.addModel(model);
          engine.repaint();
        }
      }
    })
  );
};