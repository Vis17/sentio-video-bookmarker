// INFO Tests are not complete

import OptionsManager from '../src/lib/sentio/options/optionsManager';
import VideoBookmark, { VideoData } from '../src/lib/sentio/videoBookmark';
import VideoBookmarkManager from '../src/lib/sentio/videoBookmarkManager';

// .load() accesses the browser.storage api, does not work in test, so that´s the workaround
VideoBookmarkManager.prototype.load = () => {
	return new Promise(resolve => {
		resolve();
	});
};
// .save() accesses the browser.storage api, does not work in test, so that´s the workaround
VideoBookmarkManager.prototype.save = () => {
	return new Promise(resolve => {
		resolve();
	});
};

describe('VideoBookmarkManager', () => {
	jest.useFakeTimers({ now: 0 });
	let m: VideoBookmarkManager;

	beforeEach(() => {
		// all options that require optional_permissions are opt-in, so there should
		// be no problem with the default values
		m = new VideoBookmarkManager(new OptionsManager());
	});

	function getVideoData(): VideoData[] {
		return [
			{
				timestamp: 1,
				baseUrl: 'base-url',
				src: 'src-1',
				duration: 10,
				lastSeen: 0,
			},
			{
				timestamp: 2,
				baseUrl: 'base-url',
				src: 'src-2',
				duration: 20,
				title: 'huh, a title?',
				lastSeen: 0,
			},
		];
	}
	function createVideoBookmarks(): VideoData[] {
		const arrayOfVideoData = getVideoData();
		arrayOfVideoData.forEach(x => m.create(x));

		return arrayOfVideoData;
	}

	it('.toggle', async () => {
		const [vid1, vid2] = getVideoData();

		await m.create(vid1);

		// TEST Delete
		await m.toggle(vid1);
		expect(m.has(vid1.src)).toBe(false);

		// TEST Create 2nd
		await m.toggle(vid2);
		expect(m.has(vid2.src)).toBe(true);

		// TEST Create
		await m.toggle(vid1);
		expect(m.has(vid1.src)).toBe(true);
	});

	it('.query', () => {
		const [vid1, vid2] = createVideoBookmarks();

		expect(m.query({ timestamp: 1 })).toEqual([new VideoBookmark(vid1)]);
		expect(m.query({ timestamp: 124, duration: 126 })).toEqual([]);
		expect(m.query({})).toEqual([
			new VideoBookmark(vid1),
			new VideoBookmark(vid2),
		]);
		expect(m.query({ title: undefined })).toEqual([
			new VideoBookmark(vid1),
		]);

		// TEST output sorting based on .lastSeen
		vid2.lastSeen = 1;
		m['_data'].set(vid2.src, new VideoBookmark(vid2));

		expect(m.query({})).toEqual([
			new VideoBookmark(vid2),
			new VideoBookmark(vid1),
		]);
	});

	it('.isBookmark', () => {
		const [vid1, vid2] = createVideoBookmarks();

		expect(m.isBookmark(vid1)).toBe(true);
		expect(
			m.isBookmark({
				src: 'dummy',
				baseUrl: vid2.baseUrl,
				duration: vid2.duration,
				timestamp: 0,
			})
		).toBe(true);
		expect(
			m.isBookmark({
				src: 'dummy',
				baseUrl: 'dummy',
				duration: vid2.duration,
				timestamp: 0,
			})
		).toBe(false);
	});

	it('.export', () => {
		const arrOfVideoData = createVideoBookmarks();

		expect(m.export()).toEqual(arrOfVideoData);
	});

	it('.import', () => {
		const arrayOfVideoData = getVideoData();

		// TEST default with VideoData[]
		m.import(arrayOfVideoData);
		expect(m.export()).toEqual(arrayOfVideoData);

		// TEST without clearing with VideoData[]
		const vid: VideoData = {
			title: 'title',
			baseUrl: 'base-url',
			src: 'src-53244',
			duration: 3,
			timestamp: 2,
		};
		m.import([vid], false);
		expect(m.export()).toEqual([
			...arrayOfVideoData,
			{ ...vid, lastSeen: 0 },
		]);

		// TEST with VideoBookmark[]
		const a: VideoBookmark[] = arrayOfVideoData.map(
			x => new VideoBookmark(x)
		);
		m.import(a);
		expect(m.export()).toEqual(a.map(x => x.export()));

		// TEST without clearing with VideoBookmark[]
		m.import([new VideoBookmark(vid)], false);
		expect(m.export()).toEqual([
			...arrayOfVideoData,
			{ ...vid, lastSeen: 0 },
		]);
	});
});
