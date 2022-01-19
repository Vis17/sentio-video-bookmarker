// INFO Tests are not complete

import ExportData from '../src/lib/sentio/exportData';

describe('test ExportData', () => {
	it('.isValid() [static]', () => {
		//#region version check
		expect(ExportData.isValid({ version: '1.0.0' })).toBe(true);
		expect(ExportData.isValid({ version: 2 })).toBe(false);
		//#endregion

		//#region data check
		expect(ExportData.isValid({ version: '1', data: [1, 2] })).toBe(false);
		expect(ExportData.isValid({ version: '1', data: '1' })).toBe(false);
		expect(ExportData.isValid({ version: '1', data: 23 })).toBe(false);
		expect(ExportData.isValid({ version: '1', data: [] })).toBe(true);
		expect(
			ExportData.isValid({
				version: '1',
				data: [
					{
						timestamp: 1,
						baseUrl: 'base-url',
						src: 'src-1',
						duration: 10,
					},
				],
			})
		).toBe(true);
		expect(
			ExportData.isValid({
				version: '1',
				data: [
					{
						timestamp: 1,
						baseUrl: 'base-url',
						src: 'src-1',
						duration: 10,
					},
					'this should fail',
				],
			})
		).toBe(false);
		//#endregion

		//#region options check
		expect(ExportData.isValid({ version: '1', options: 12 })).toBe(false);
		expect(ExportData.isValid({ version: '1', options: '12' })).toBe(false);
		expect(ExportData.isValid({ version: '1', options: [1] })).toBe(false);
		expect(ExportData.isValid({ version: '1', options: [] })).toBe(false);
		expect(ExportData.isValid({ version: '1', options: {} })).toBe(true);
		expect(
			ExportData.isValid({
				version: '1',
				options: {
					'developer-mode': true,
					'page-auto-reload': false,
					'video-browser-bookmark-base': 'wow, a string',
				},
			})
		).toBe(true);
		expect(
			ExportData.isValid({
				version: '1',
				options: {
					'developer-mode': 'asdasda',
				},
			})
		).toBe(false);
		expect(
			ExportData.isValid({
				version: '1',
				options: {
					'developer-mode': true,
					'video-browser-bookmark-base': 8,
				},
			})
		).toBe(false);
		expect(
			ExportData.isValid({
				version: '1',
				options: {
					'developer-mode': true,
					'page-auto-reload': 'asdasda',
				},
			})
		).toBe(false);
		//#endregion

		expect(
			ExportData.isValid({
				version: '1',
				options: {
					'developer-mode': true,
					'video-browser-bookmark-base': 'asdasda',
				},
				data: [
					{
						timestamp: 1,
						baseUrl: 'base-url',
						src: 'src-1',
						duration: 10,
					},
				],
			})
		).toBe(true);
	});
});
