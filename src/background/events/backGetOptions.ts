import { OptionId } from '../../lib/sentio/options/options';
import { BrowserRuntimeBackgroundEvent } from '../../types';

const event: BrowserRuntimeBackgroundEvent = {
	name: 'back-get-options',
	execute: (sender, res, sentio, key: OptionId) => {
		if (key) {
			res(sentio?.options.get(key));
			return;
		}

		res(sentio?.options.export());
	},
};

export default event;
