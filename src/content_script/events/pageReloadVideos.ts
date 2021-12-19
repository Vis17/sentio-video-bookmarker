import { BrowserRuntimePageEvent } from '../../types';
import PageManager from '../pageManager';

const event: BrowserRuntimePageEvent = {
	name: 'page-reload-videos',
	execute: async (
		sender,
		pageManager: PageManager,
		res: (res: unknown) => void
	) => {
		res(await pageManager.processVideos());
	},
};

export default event;
