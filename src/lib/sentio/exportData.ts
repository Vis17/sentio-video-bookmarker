import optionConfigs, { OptionId, OptionValuesMapped } from './options/options';
import VideoBookmark, { VideoData } from './videoBookmark';

export default class ExportData {
	constructor(
		public version: string,
		public data?: VideoData[],
		public options?: OptionValuesMapped
	) {}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	static isValid(d: any): boolean {
		// just don´t look at it, it´s not (that) pretty, but according to my (💩) tests
		// LINK test/exportData.test.ts
		// it works

		// version
		if (!d?.version || typeof d?.version !== 'string') return false;
		// data
		if (
			d?.data &&
			(!Array.isArray(d?.data) ||
				!d?.data?.every?.((x: unknown) =>
					VideoBookmark.isValid(x as VideoData)
				))
		)
			return false;
		// options
		const optionConfigKeys = Object.keys(optionConfigs);
		if (
			d?.options &&
			(typeof d?.options !== 'object' ||
				Array.isArray(d?.options) ||
				!Object.keys?.(d?.options).every(
					x =>
						optionConfigKeys.includes(x) &&
						typeof optionConfigs[x as OptionId]?.default ===
							typeof d?.options[x]
				))
		)
			return false;

		return true;
	}
}
