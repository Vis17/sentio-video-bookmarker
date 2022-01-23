// INFO Tests are not complete

import optionConfigs from '../src/lib/sentio/options/options';
import OptionsManager from '../src/lib/sentio/options/optionsManager';

// .load() accesses the browser.storage api, does not work in test, so that´s the workaround
OptionsManager.prototype.load = () => {
	return new Promise(resolve => {
		resolve();
	});
};
// .save() accesses the browser.storage api, does not work in test, so that´s the workaround
OptionsManager.prototype.save = () => {
	return new Promise(resolve => {
		resolve();
	});
};

describe('test OptionManager', () => {
	let om: OptionsManager;
	beforeEach(() => {
		om = new OptionsManager();
	});

	it('initializes default values correct', () => {
		expect(om.get('video-auto-update-bookmark')).toBe(
			optionConfigs['video-auto-update-bookmark'].default
		);
	});

	it('imports works correctly', () => {
		// TEST default 'ignore'
		om.import({ 'video-auto-load-last-timestamp': false });
		om.import({ 'video-auto-update-bookmark': false });

		expect(om.get('video-auto-load-last-timestamp')).toBe(false);

		// TEST reset
		om.import({ 'video-auto-update-bookmark': true }, 'reset');

		expect(om.get('video-auto-load-last-timestamp')).toBe(
			optionConfigs['video-auto-load-last-timestamp'].default
		);
		expect(om.get('video-auto-update-bookmark')).toBe(true);

		// TEST 'false'
		om.import({ 'video-auto-load-last-timestamp': true }, 'false');

		expect(om.get('video-auto-load-last-timestamp')).toBe(true);
		expect(om.get('video-auto-update-bookmark')).toBe(false);
	});
});
