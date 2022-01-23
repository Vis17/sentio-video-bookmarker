import { VideoData } from '../../lib/sentio/videoBookmark';
import { BrowserRuntimeBackgroundEvent } from '../../types';

const event: BrowserRuntimeBackgroundEvent = {
	name: 'back-videos',
	execute: async (sender, res, sentio, videos: VideoData[]) => {
		if (sentio?.activePage.tabId !== sender.tab?.id) return;

		// reset activePage
		sentio?.activePage.clearVideos();

		if (videos.length === 0) return;

		sentio?.activePage.addVideos(videos);
		res([
			...(sentio?.activePage
				.getCurrentVideoBookmarks()
				.map(x => x?.export()) ?? []),
		]);
	},
};

export default event;
