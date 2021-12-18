import VideoBookmark, { VideoData } from './videoBookmark';
import type VideoBookmarkManager from './videoBookmarkManager';

export default class ActivePage {
	private _tabId!: number;
	private _url = '';
	private _videos: VideoData[] = [];
	private _videoBookmarks: VideoBookmarkManager;

	constructor(videoBookmarkManager: VideoBookmarkManager) {
		this._videoBookmarks = videoBookmarkManager;
	}

	/** The tab-id the activePage is running in */
	get tabId() {
		return this._tabId;
	}
	/** The url of the activePage */
	get url() {
		return this._url;
	}
	/** Sets the tab-id and url for the activePage */
	setActiveTab(id: number, url: string) {
		this._tabId = id;
		this._url = url;
	}

	/** Videos on activePage */
	get videos() {
		return this._videos;
	}
	/** Resets the videos on activePage */
	clearVideos() {
		this._videos = [];
	}
	/** Adds videos on activePage */
	addVideos(videos: VideoData[]) {
		videos.forEach(x => this.addVideo(x));

		// this.getCurrentVideoBookmarks();
	}
	private addVideo(video: VideoData) {
		this._videos.push(video);
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
		this._videos.forEach(vid =>
			// pick VideoBookmarks
			videoBookmarks.push(...this._videoBookmarks.query({ src: vid.src }))
		);

		return videoBookmarks;
	}
}
