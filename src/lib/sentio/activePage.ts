import { PageEventName } from '../../types';
import OptionsManager from './options/optionsManager';
import VideoBookmark, { VideoData } from './videoBookmark';
import type VideoBookmarkManager from './videoBookmarkManager';

export default class ActivePage {
	private _tabId!: number;
	private _url = '';
	private _videos: VideoData[] = [];
	private _notLoadedVideos = 0;

	constructor(
		private _videoBookmarkManager: VideoBookmarkManager,
		private _optionsManager: OptionsManager
	) {}

	/** The tab-id the activePage is running in */
	get tabId() {
		return this._tabId;
	}
	/** The url of the activePage */
	get url() {
		return this._url;
	}
	/** Sets the tab-id and url for the activePage */
	setActiveTab(id: number, url?: string) {
		this._tabId = id;
		this._url = url ?? '';

		this.reloadVideos();
	}

	/** Videos on activePage */
	get videos() {
		return this._videos;
	}
	/** Videos that are on the page, but their metadata is not loaded. */
	get notLoadedVideos() {
		return this._notLoadedVideos;
	}
	/** Resets the videos on activePage */
	clearVideos() {
		this._videos = [];
		this._notLoadedVideos = 0;
	}
	/** Adds videos on activePage */
	addVideos(videos: VideoData[]) {
		videos.forEach(x => this.addVideo(x));
	}
	private addVideo(video: VideoData) {
		if (VideoBookmark.isValid(video)) return this._videos.push(video);

		this._notLoadedVideos++;
	}
	updateVideo(video: VideoData) {
		try {
			this._videos[this._videos.findIndex(x => x.src === video.src)] =
				video;
		} catch (err) {
			console.error(err);
		}
	}

	getCurrentVideoBookmarks(): VideoBookmark[] {
		const videoBookmarks: VideoBookmark[] = [];

		// iterate through all videos
		this._videos.forEach(vid => {
			// pick VideoBookmarks
			videoBookmarks.push(
				...this._videoBookmarkManager.query({ src: vid.src })
			);
			if (this._optionsManager.get('video-enable-guessing'))
				videoBookmarks.push(
					...this._videoBookmarkManager.query({
						baseUrl: vid.baseUrl,
						duration: vid.duration,
					})
				);
		});

		const seenItems: string[] = [];

		return videoBookmarks.filter(x => {
			if (seenItems.includes(x.src)) return false;
			seenItems.push(x.src);
			return true;
		});
	}

	/**
	 * Reloads the vieos on the page through a message to the content-script
	 */
	async reloadVideos() {
		this._videos = [];
		try {
			await this.sendMessage('page-reload-videos');
		} catch (err) {
			//
		}
	}

	private sendMessage<T>(
		event: PageEventName,
		...args: unknown[]
	): Promise<T> {
		return browser.tabs.sendMessage(this.tabId, [event, ...args]);
	}
}
