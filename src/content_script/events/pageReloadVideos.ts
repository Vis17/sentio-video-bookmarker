import { VideoData } from '../../lib/sentio/videoBookmark';
import { BrowserRuntimePageEvent } from '../../types';
import PageManager from '../pageManager';

const event: BrowserRuntimePageEvent = {
	name: 'page-reload-videos',
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	execute: (sender, pageManager: PageManager, video: VideoData) => {
		// pageManager.reload // TODO or something like that
	},
};

export default event;
