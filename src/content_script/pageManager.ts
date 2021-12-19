import { OptionId, OptionValue } from '../lib/sentio/options/options';
import { VideoData } from '../lib/sentio/videoBookmark';
import { BackgroundEventName } from '../types';

export default class PageManager {
	constructor() {
		this.processVideos();
	}

	async processVideos(videos?: HTMLVideoElement[]): Promise<void> {
		if (!videos) return this.processVideos(this.getVideoElements());

		videos.forEach(video => {
			// TODO remove event-listeners somehow...
			// video.removeEventListener('timeupdate', pageManager.onVideoTimeupdate);

			// eslint-disable-next-line @typescript-eslint/no-this-alias
			const pageManager = this;

			video.addEventListener('timeupdate', function () {
				pageManager.onVideoTimeupdate(this);
			});
		});

		this.setVideoTimes(videos, await this.sendVideos(videos));
	}
	private sendVideos(videos?: HTMLVideoElement[]): Promise<VideoData[]> {
		if (!videos) return this.sendVideos(this.getVideoElements());

		return sendMessage('back-videos', this.getVideoData(videos));
	}
	private getVideoData(videos: HTMLVideoElement[]): VideoData[] {
		const videoData: VideoData[] = [];
		videos.forEach(video => {
			videoData.push({
				title: document.title,
				timestamp: video.currentTime,
				duration: video.duration,
				baseUrl: window.location.toString(),
				src: video.src,
			});
		});
		return videoData;
	}
	private getVideoElements() {
		return [...document.getElementsByTagName('video')];
	}

	private async setVideoTimes(
		videos: HTMLVideoElement[],
		videoBookmarks: VideoData[]
	) {
		if (await getOptions('video-auto-load-last-timestamp'))
			videos
				.filter(v => videoBookmarks?.map(x => x.src).includes(v.src))
				.forEach(video => {
					this.setVideoTime(
						video,
						videoBookmarks.find(x => x.src === video.src)
					);
				});
	}
	private setVideoTime(video: HTMLVideoElement, videoBookmark?: VideoData) {
		video.currentTime = videoBookmark?.timestamp ?? 0;
	}

	private async onVideoTimeupdate(video: HTMLVideoElement): Promise<void> {
		sendMessage('back-video-update', this.getVideoData([video])?.[0]);
	}
}

//#region util
function sendMessage<T>(
	event: BackgroundEventName,
	...args: unknown[]
): Promise<T> {
	return browser.runtime.sendMessage([event, ...args]);
}

/** Requests the options from the background-page */
function getOptions(): Promise<{ [key in OptionId]: OptionValue }>;
/**
 * Requests the options from the background-page
 * @param key The value of the option with this key will be returned
 */
function getOptions(key: OptionId): Promise<OptionValue>;
function getOptions(
	key?: OptionId
): Promise<{ [key in OptionId]: OptionValue } | OptionValue> {
	if (key) return sendMessage('back-get-options', key);
	return sendMessage('back-get-options');
}
//#endregion
