import PageManager from './content_script/pageManager';
import Sentio from './lib/sentio/sentio';

export type BrowserRuntimeBackgroundEventData = [
	BackgroundEventName,
	...unknown[]
];
export interface BrowserRuntimeBackgroundEvent {
	name: BackgroundEventName;
	execute(
		sender: browser.runtime.MessageSender,
		res: (response?: unknown) => unknown,
		sentio: Sentio | undefined,
		...args: unknown[]
	): unknown;
}
export type BrowserRuntimePageEventData = [PageEventName, ...unknown[]];
export interface BrowserRuntimePageEvent {
	name: PageEventName;
	execute(
		sender: browser.runtime.MessageSender,
		pageManager: PageManager,
		...args: unknown[]
	): unknown;
}

export type BackgroundEventName =
	| 'back-videos'
	| 'back-video-update'
	| 'back-get-options';
export type PageEventName = 'page-reload-videos';
