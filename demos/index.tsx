import * as React from 'react';
import { addDecorator } from '@storybook/react';
import { setOptions } from '@storybook/addon-options';
import { withKnobs } from '@storybook/addon-knobs/react';
//include the SCSS for the demo
import './.helpers/demo.scss';
import '../src/sass/main.scss';

addDecorator(withKnobs);

setOptions({
  name: 'STORM React Canvas',
  url: 'https://github.com/projectstorm/react-canvas',
  addonPanelInRight: true
});
