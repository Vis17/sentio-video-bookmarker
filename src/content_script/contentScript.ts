import { BrowserRuntimePageEventData } from '../types';
import events from './events';
import PageManager from './pageManager';

(function () {
	const pageManager = new PageManager();

	// background-script-message => see /src/content_script/events/index.ts
	browser.runtime.onMessage.addListener(
		(msg: BrowserRuntimePageEventData, sender) => {
			events
				.filter(event => event.name === msg[0])
				.forEach(event =>
					event.execute(sender, pageManager, ...msg.slice(1))
				);
		}
	);
})();
