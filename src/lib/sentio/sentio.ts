import ActivePage from './activePage';
import OptionsManager from './options/optionsManager';
import VideoBookmarkManager from './videoBookmarkManager';

export default class Sentio {
	private _videoBookmarks: VideoBookmarkManager;
	private _activePage: ActivePage;
	private _options: OptionsManager;

	constructor() {
		this._videoBookmarks = new VideoBookmarkManager();
		this._activePage = new ActivePage(this.videoBookmarks);
		this._options = new OptionsManager();
	}

	get videoBookmarks() {
		return this._videoBookmarks;
	}
	get activePage() {
		return this._activePage;
	}
	get options() {
		return this._options;
	}

	async save(): Promise<void> {
		this._videoBookmarks.save();
		this._options.save();
	}
	async load(): Promise<void> {
		this._videoBookmarks.load();
		this._options.load();
	}
}
