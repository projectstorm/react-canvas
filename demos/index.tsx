import * as React from 'react';
import { storiesOf, addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { withKnobs, text, boolean, number } from '@storybook/addon-knobs/react';
import { configureViewport } from '@storybook/addon-viewport';
//include the SCSS for the demo
import './.helpers/demo.scss';
import '../src/sass/main.scss';

addDecorator(withKnobs);

setOptions({
	name: 'STORM React Canvas',
	url: 'https://github.com/projectstorm/react-canvas',
	addonPanelInRight: true
});
