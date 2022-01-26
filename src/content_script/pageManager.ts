import { OptionId, OptionValuesMapped } from '../lib/sentio/options/options';
import VideoBookmark, { VideoData } from '../lib/sentio/videoBookmark';
import { BackgroundEventName } from '../types';

/** Attribute names for HTML-Videos */
const SENTIO_ATTRIBUTES = {
	/** The guessed src-attribute, if turned on. */
	GUESS: 'sentio-guess-src',
	/** Marks every video, watched by event listeners. */
	KNOWN: 'sentio-video-known',
};

export default class PageManager {
	constructor() {
		this.processVideos();

		// use a MutationObserver to update all videos on DOM changes
		new MutationObserver(() => this.processVideos()).observe(
			document.body,
			{
				childList: true,
				subtree: true,
			}
		);
	}

	async processVideos(videos?: HTMLVideoElement[]): Promise<void> {
		if (!videos) return this.processVideos(this.getVideoElements());

		const videoBookmarks = (await this.sendVideos(videos)) ?? [];
		const unknownVideos: HTMLVideoElement[] = [];

		videos.forEach(video => {
			// make sure, to only attach event-listeners, to unknown videos
			if (
				video.hasAttribute(SENTIO_ATTRIBUTES.KNOWN) ||
				!VideoBookmark.isValid(this.getVideoData(video))
			)
				return;

			video.setAttribute(SENTIO_ATTRIBUTES.KNOWN, '');

			video.addEventListener('timeupdate', () => {
				this.onVideoTimeupdate(video);
			});

			video.addEventListener('durationchange', async () => {
				const videoBookmarks = (await this.sendVideos(videos)) ?? [];

				// update this video
				await this.setGuessedSrc([video], videoBookmarks);
				this.setVideoTimes([video], videoBookmarks);
			});

			unknownVideos.push(video);
		});

		if (unknownVideos.length === 0) return;

		await this.setGuessedSrc(videos, videoBookmarks);
		await this.setVideoTimes(unknownVideos, videoBookmarks);
	}
	private sendVideos(
		videos?: HTMLVideoElement[]
	): Promise<VideoData[] | undefined> {
		if (!videos) return this.sendVideos(this.getVideoElements());

		return sendMessage('back-videos', this.getVideoData(videos));
	}
	private getVideoData(video: HTMLVideoElement): VideoData;
	private getVideoData(videos: HTMLVideoElement[]): VideoData[];
	private getVideoData(
		videoOrVideos: HTMLVideoElement[] | HTMLVideoElement
	): VideoData[] | VideoData {
		if (videoOrVideos instanceof HTMLVideoElement)
			return {
				title: document.title,
				timestamp: Math.round(videoOrVideos.currentTime),
				duration: Math.round(videoOrVideos.duration),
				baseUrl: window.location.toString(),
				src:
					videoOrVideos.getAttribute(SENTIO_ATTRIBUTES.GUESS) ||
					videoOrVideos.currentSrc,
			};

		const videoData: VideoData[] = [];
		videoOrVideos.forEach(x => videoData.push(this.getVideoData(x)));
		return videoData;
	}
	private getVideoElements() {
		return [...document.getElementsByTagName('video')];
	}
	private async setGuessedSrc(
		videos: HTMLVideoElement[],
		videoBookmarks: VideoData[]
	) {
		if (!(await getOptions('video-enable-guessing'))) return;

		// first remove all attributes
		videos.forEach(v => v.removeAttribute?.(SENTIO_ATTRIBUTES.GUESS));
		videos
			.filter(
				v =>
					// filter videos to guess
					videoBookmarks
						?.map(x => x.duration)
						?.includes(Math.round(v.duration)) &&
					videoBookmarks
						?.map(x => x.baseUrl)
						?.includes(window.location.toString())
			)
			.forEach(video =>
				video.setAttribute(
					SENTIO_ATTRIBUTES.GUESS,
					videoBookmarks.find(
						x =>
							x.baseUrl === window.location.toString() &&
							x.duration === Math.round(video.duration)
					)?.src ?? ''
				)
			);
	}

	private async setVideoTimes(
		videos: HTMLVideoElement[],
		videoBookmarks: VideoData[]
	) {
		if (await getOptions('video-auto-load-last-timestamp'))
			videos
				.filter(v =>
					videoBookmarks
						?.map(x => x.src)
						?.includes(
							v.getAttribute(SENTIO_ATTRIBUTES.GUESS) || v.src
						)
				)
				.forEach(video =>
					this.setVideoTime(
						video,
						videoBookmarks.find(
							x =>
								x.src ===
									video.getAttribute(
										SENTIO_ATTRIBUTES.GUESS
									) || video.src
						)
					)
				);
	}
	private setVideoTime(video: HTMLVideoElement, videoBookmark?: VideoData) {
		if (
			videoBookmark?.timestamp &&
			// make sure to only update if there is a significant change
			(video.currentTime - 1 > videoBookmark.timestamp ||
				video.currentTime + 1 < videoBookmark.timestamp)
		)
			video.currentTime = videoBookmark.timestamp;
	}

	private async onVideoTimeupdate(video: HTMLVideoElement): Promise<void> {
		const data = this.getVideoData(video);
		if (VideoBookmark.isValid(data)) sendMessage('back-video-update', data);
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
function getOptions(): Promise<OptionValuesMapped>;
/**
 * Requests the options from the background-page
 * @param key The value of the option with this key will be returned
 */
function getOptions<T extends OptionId>(key: T): Promise<OptionValuesMapped[T]>;
function getOptions<T extends OptionId>(
	key?: T
): Promise<OptionValuesMapped | OptionValuesMapped[T]> {
	if (key) return sendMessage('back-get-options', key);
	return sendMessage('back-get-options');
}
//#endregion
