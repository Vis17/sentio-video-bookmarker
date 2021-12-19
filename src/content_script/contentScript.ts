import { BrowserRuntimePageEventData } from '../types';
import events from './events';
import PageManager from './pageManager';

(function () {
	const pageManager = new PageManager();

	// background-script-message => see LINK src/content_script/events/index.ts
	browser.runtime.onMessage.addListener(
		(
			msg: BrowserRuntimePageEventData,
			sender,
			res: (res: unknown) => void
		) => {
			events
				.filter(event => event.name === msg[0])
				.forEach(event =>
					event.execute(sender, pageManager, res, ...msg.slice(1))
				);
		}
	);
})();
