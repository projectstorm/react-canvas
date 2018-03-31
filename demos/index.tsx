import * as React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";
import { host } from "storybook-host";
import { withKnobs, text, boolean, number } from "@storybook/addon-knobs/react";
//include the SCSS for the demo
import "./.helpers/demo.scss";
import "../src/sass/main.scss";

addDecorator(
	host({
		cropMarks: false,
		height: "100%",
		width: "100%",
		padding: 20
	})
);

addDecorator(withKnobs);

setOptions({
	name: "STORM React Canvas",
	url: "https://github.com/projectstorm/react-canvas",
	addonPanelInRight: true
});
