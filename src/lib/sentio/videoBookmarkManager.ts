import VideoBookmark, { VideoData } from './videoBookmark';

export default class VideoBookmarkManager {
	private _data: Map<string, VideoBookmark>;

	constructor() {
		// initialize
		this._data = new Map();

		this.load();
	}

	/**
	 * Create a new VideoBookmark.
	 *
	 * ***The VideoBookmarks are unique by their src-attribute!***
	 * @param videoData The video data, the VideoBookmark is created on.
	 */
	create(videoData: VideoData) {
		if (videoData) this.set(new VideoBookmark(videoData));
	}
	/**
	 * Delete a VideoBookmark by its src-attribute.
	 * @param src The src-attribute of the VideoBookmark to delete.
	 */
	delete(src: string) {
		this._data.delete?.(src);

		this.save();
	}
	/**
	 * Deletes all VideoBookmarks.
	 */
	deleteAll() {
		this._data.clear();

		this.save();
	}
	/**
	 * Updates a given VideoBookmark
	 * @param videoBookmark
	 * @returns Whether or not the VideoBookmark was present && updated.
	 */
	update(videoBookmark: VideoBookmark): boolean {
		if (!this._data.has(videoBookmark.src)) return false;
		this.set(videoBookmark);
		return true;
	}
	private set(videoBookmark: VideoBookmark) {
		this._data.set(videoBookmark.src, videoBookmark);

		this.save();
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

	/**
	 * Saves the videobookmark-data to the local extension storage.
	 *
	 * Should be called after each modification.
	 */
	async save(): Promise<void> {
		await browser.storage.local.set({ data: this.export() });
	}
	/** Loads the videobookmark-data from the local extension storage and tries to import the data */
	async load(): Promise<void> {
		try {
			this.import((await browser.storage.local.get('data'))?.['data']);
		} catch (error) {
			// console.error(error);
		}
	}
}
