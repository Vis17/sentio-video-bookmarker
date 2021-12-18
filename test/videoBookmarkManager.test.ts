// INFO Tests are not complete

import VideoBookmark, { VideoData } from '../src/lib/sentio/videoBookmark';
import VideoBookmarkManager from '../src/lib/sentio/videoBookmarkManager';

describe('VideoBookmarkManager', () => {
	let m: VideoBookmarkManager;

	beforeEach(() => {
		m = new VideoBookmarkManager();
	});

	function getVideoData(): VideoData[] {
		return [
			{
				timestamp: 1,
				baseUrl: 'base-url',
				src: 'src-1',
				duration: 10,
			},
			{
				timestamp: 2,
				baseUrl: 'base-url',
				src: 'src-2',
				duration: 20,
				title: 'huh, a title?',
			},
		];
	}
	function createVideoBookmarks(): VideoData[] {
		const arrayOfVideoData = getVideoData();
		arrayOfVideoData.forEach(x => m.create(x));

		return arrayOfVideoData;
	}

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
		expect(m.export()).toEqual([...arrayOfVideoData, vid]);

		// TEST with VideoBookmark[]
		const a: VideoBookmark[] = arrayOfVideoData.map(
			x => new VideoBookmark(x)
		);
		m.import(a);
		expect(m.export()).toEqual(a.map(x => x.export()));

		// TEST without clearing with VideoBookmark[]
		m.import([new VideoBookmark(vid)], false);
		expect(m.export()).toEqual([...arrayOfVideoData, vid]);
	});
});
