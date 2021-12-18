import VideoBookmark, { VideoData } from './videoBookmark';

export default class VideoBookmarkManager {
	private _data: Map<string, VideoBookmark>;

	constructor() {
		this._data = new Map();
	}

	create(videoData: VideoData) {
		if (videoData) this.set(new VideoBookmark(videoData));
	}
	update(videoBookmark: VideoBookmark) {
		this.set(videoBookmark);
	}
	private set(videoBookmark: VideoBookmark) {
		this._data.set(videoBookmark.src, videoBookmark);
	}
	has(src: string): boolean {
		return this._data.has(src);
	}
	get(src: string) {
		return this._data.get(src);
	}

	/** Query the VideoBookmarks */
	query(q: Partial<VideoData>): VideoBookmark[] {
		const qEntries = Object.entries(q);

		return [...this._data.values()].filter(vidBookmark => {
			let failed = false;
			qEntries.forEach(entry => {
				if (
					vidBookmark.export()[entry[0] as keyof VideoData] !==
					entry[1]
				) {
					failed = true;
				}
			});
			return !failed;
		});
	}

	/**
	 * Export the video-bookmarks
	 */
	export(): VideoData[] {
		return [...this._data.values()].map(x => x.export());
	}
	/**
	 * Imports data to the VideoData
	 * @param arr The array of objects to import
	 * @param {boolean} [clear=true] Determines whether all bookmarks should be cleared first or not. Default `true`
	 */
	import(arr: VideoBookmark[], clear?: boolean): void;
	/**
	 * Imports data to the VideoData
	 * @param arr The array of objects to import
	 * @param {boolean} [clear=true] Determines whether all bookmarks should be cleared first or not. Default `true`
	 */
	import(arr: VideoData[], clear?: boolean): void;
	import(arr: (VideoBookmark | VideoData)[], clear = true): void {
		if (clear) this._data.clear();

		arr?.forEach?.(x =>
			this.set(x instanceof VideoBookmark ? x : new VideoBookmark(x))
		);
	}
}
