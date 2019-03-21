import { LayerModel } from '../primitives-core/layer/LayerModel';
import { CanvasEngine } from '../CanvasEngine';
import * as _ from 'lodash';
import { EllipseElementModel } from '../primitives/ellipse/EllipseElementModel';

export const installDebugInteractivity = (engine: CanvasEngine) => {
  // debug layer
  const debugLayer = new LayerModel();
  debugLayer.setSVG(true);
  debugLayer.setTransformable(true);

  engine.addListener({
    modelChanged: event => {
      if (event.oldModel) {
        event.oldModel.removeLayer(debugLayer);
      }
      if (event.model) {
        event.model.addLayer(debugLayer);
      }
    },
    repaint: () => {
      engine.getModel().layers.moveModelToFront(debugLayer);
      debugLayer.clearEntities();
      _.forEach(engine.getModel().getElements(), element => {
        let dimensions = element.getDimensions();
        if (dimensions) {
          debugLayer.addModels(
            _.map(EllipseElementModel.createPointCloudFrom(dimensions, 3 / engine.getModel().getZoomLevel()), point => {
              point.background = 'mediumpurple';
              return point;
            })
          );
        }
      });
    }
  });
};
