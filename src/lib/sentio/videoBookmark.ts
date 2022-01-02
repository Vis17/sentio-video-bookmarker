export interface VideoData {
	title?: string;
	timestamp: number;
	duration: number;
	baseUrl: string;
	src: string;
	browserBookmarkId?: string;
}
export default class VideoBookmark {
	static isValid(d: VideoBookmark): boolean;
	static isValid(d: VideoData): boolean;
	static isValid(d: VideoBookmark | VideoData): boolean {
		if (!d.baseUrl && d.baseUrl !== '') return false;
		if ((!d.duration && d.duration !== 0) || isNaN(d.duration))
			return false;
		if (
			(!d.timestamp && d.timestamp !== 0) ||
			isNaN(d.timestamp) ||
			d.timestamp > d.duration
		)
			return false;
		if (!d.src) return false;

		return true;
	}

	private _data: VideoData;

	constructor(data: VideoData) {
		this._data = { ...data };

		// fix not allowed floats while editing
		// should be precise enough ;)
		this._data.duration = Math.round(this._data.duration);
		this._data.timestamp = Math.round(this._data.timestamp);
	}

	get title() {
		return this._data.title;
	}
	get src() {
		return this._data.src;
	}
	get baseUrl() {
		return this._data.baseUrl;
	}
	get timestamp() {
		return this._data.timestamp;
	}
	get duration() {
		return this._data.duration;
	}
	get browserBookmarkId() {
		return this._data.browserBookmarkId;
	}

	export(): VideoData {
		return {
			title: this.title,
			baseUrl: this.baseUrl,
			src: this.src,
			timestamp: this.timestamp,
			duration: this.duration,
			browserBookmarkId: this.browserBookmarkId,
		};
	}
}
