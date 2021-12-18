import VideoBookmark, { VideoData } from '../../lib/sentio/videoBookmark';
import { BrowserRuntimeBackgroundEvent } from '../../types';

const event: BrowserRuntimeBackgroundEvent = {
	name: 'back-video-update',
	execute: (sender, res, sentio, video: VideoData) => {
		sentio?.activePage.updateVideo(video);

		// check for bookmark && for video-auto-update-bookmark option => update
		if (
			!sentio?.videoBookmarks.has(video.src) || // no bookmark ||
			!sentio?.options.get('video-auto-update-bookmark') // 'video-auto-update-bookmark' = false
		)
			return;
		sentio.videoBookmarks.update(new VideoBookmark(video));
	},
};

export default event;
