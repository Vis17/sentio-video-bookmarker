import OptionsManager from './options/optionsManager';
import VideoBookmark, { VideoData } from './videoBookmark';

export default class VideoBookmarkManager {
	private _data: Map<string, VideoBookmark>;

	constructor(private _options: OptionsManager) {
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
	async create(videoData: VideoData) {
		if (!videoData) return;

		if (
			this._options.get('video-manage-browser-bookmark') &&
			(await browser.permissions.contains({
				permissions: ['bookmarks'],
			}))
		) {
			videoData.browserBookmarkId = (
				await browser.bookmarks.create({
					url: videoData.baseUrl,
					type: 'bookmark',
					title: this._options
						.get('video-browser-bookmark-base')
						.replace(/\$title/gi, videoData.title ?? ''),
				})
			).id;
		}

		this.set(new VideoBookmark(videoData));
	}
	/**
	 * Delete a VideoBookmark by its src-attribute.
	 * @param src The src-attribute of the VideoBookmark to delete.
	 */
	async delete(src: string) {
		const videoBookmark = this._data.get?.(src);
		if (
			(await browser.permissions.contains({
				permissions: ['bookmarks'],
			})) &&
			videoBookmark?.browserBookmarkId
		)
			try {
				// @ts-expect-error workaround, because of missing function declaration in @types/firefox-webext-browser,
				// see https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/57890
				await browser.bookmarks.remove(videoBookmark.browserBookmarkId);
			} catch (e) {
				//
			}

		this._data.delete?.(src);

		this.save();
	}
	/** Deletes all VideoBookmarks. */
	deleteAll() {
		this._data.forEach(videoBookmark => this.delete(videoBookmark.src));
	}
	/**
	 * Updates a given VideoBookmark
	 * @param videoBookmark
	 * @returns Whether or not the VideoBookmark was present && updated.
	 */
	async update(videoBookmark: VideoBookmark): Promise<boolean> {
		if (!this._data.has(videoBookmark.src)) return false;
		this.set(videoBookmark);

		if (
			videoBookmark.browserBookmarkId &&
			(await browser.permissions.contains({ permissions: ['bookmarks'] }))
		)
			browser.bookmarks.update(videoBookmark.browserBookmarkId, {
				title: this._options
					.get('video-browser-bookmark-base')
					.replace(/\$title/gi, videoBookmark.title ?? ''),
				url: videoBookmark.baseUrl,
			});
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
