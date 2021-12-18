// INFO Tests are not complete

import optionConfigs from '../src/lib/sentio/options/options';
import OptionsManager from '../src/lib/sentio/options/optionsManager';

describe('test OptionManager', () => {
	let om: OptionsManager;
	beforeEach(() => {
		om = new OptionsManager();
	});

	it('initializes default values correct', () => {
		expect(om.get('page-action-show')).toBe(
			optionConfigs['page-action-show'].default
		);
	});

	it('imports works correctly', () => {
		// TEST default 'ignore'
		om.import({ 'video-auto-load-last-timestamp': false });
		om.import({ 'page-action-show': false });

		expect(om.get('video-auto-load-last-timestamp')).toBe(false);

		// TEST reset
		om.import({ 'page-action-show': true }, 'reset');

		expect(om.get('video-auto-load-last-timestamp')).toBe(
			optionConfigs['video-auto-load-last-timestamp'].default
		);
		expect(om.get('page-action-show')).toBe(true);

		// TEST 'false'
		om.import({ 'video-auto-load-last-timestamp': true }, 'false');

		expect(om.get('video-auto-load-last-timestamp')).toBe(true);
		expect(om.get('page-action-show')).toBe(false);
	});
});
