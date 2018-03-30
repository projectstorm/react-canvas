import * as React from "react";
import { storiesOf, addDecorator } from "@storybook/react";
import { setOptions } from "@storybook/addon-options";
import { host } from "storybook-host";
//include the SCSS for the demo
import "./.helpers/demo.scss";
import "../src/sass/main.scss";

import Demo1 from "./demo-standard/index";

addDecorator(
	host({
		cropMarks: false,
		height: "100%",
		width: "100%",
		padding: 20
	})
);

setOptions({
	name: "STORM React Canvas",
	url: "https://github.com/projectstorm/react-canvas",
	addonPanelInRight: true
});

storiesOf("Simple Usage", module).add("Full example", Demo1);
