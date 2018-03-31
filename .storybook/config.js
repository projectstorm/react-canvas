import { configure } from '@storybook/react';

function loadStories() {
	require('../demos/index.tsx');
	require('../demos/demo-standard/index.story');
	// You can require as many demos as you need.
}

configure(loadStories, module);
