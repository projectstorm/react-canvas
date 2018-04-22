# STORM React canvas (WIP)

A brand new foundation for storm-react-diagrams

## Features

* Virtual and real co-ordinate system
* Built in primitives (square, grid, circle)
* Grouped selections
* canvas panning and zooming
* Forward constraints and inferred constraints (dimension tracking)
* pluggable state machine for interactive modes
* pluggable and modular everything
* multiple layers
* ordered canvas elements per layer
* grouped resizing via 8 anchor points
* Fit to width
* Serialization and deserialization
* History (redo and undo)

| 	|	|
|---|---|
| ![](./images/1.gif)| ![](./images/2.gif) |
| ![](./images/3.gif) | ![](./images/4.gif) |


/*

* Events always enter and exit the event bus
* Events can be intercepted before they get processed
* Multiple Actions fire based on events
* Actions enable and disable inputs on a state machine
* The state machine activates states based on inputs
* States enable and disable actions on the event bus
* States activate and deactivate which cause change in history
* history can be rolled back and forward


 */ 
