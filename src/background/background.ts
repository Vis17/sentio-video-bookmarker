import Sentio from '../lib/sentio/sentio';
import events from './events';
import { BrowserRuntimeBackgroundEventData } from '../types';

// browser.runtime.onStartup.addListener(async () => {
// });

(function () {
	window.sentio = new Sentio();
})();

// content-script-message => LINK src/background/events/index.ts
browser.runtime.onMessage.addListener(
	(msg: BrowserRuntimeBackgroundEventData, sender, res) => {
		events
			.filter(event => event.name === msg[0])
			.forEach(event =>
				event.execute(sender, res, window.sentio, ...msg.slice(1))
			);
	}
);

// tab-update
browser.tabs.onUpdated.addListener(async (tabId, change) => {
	const activeTabId = (
		await browser.tabs.query({
			active: true,
			currentWindow: true,
		})
	)?.[0]?.id;

	if (activeTabId !== tabId || !change.url) return;

	window.sentio?.activePage.setActiveTab(activeTabId, change.url);
});