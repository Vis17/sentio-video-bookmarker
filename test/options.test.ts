// INFO Tests are not complete

import optionConfigs, {
	arrayOfOptionConfigs,
	OptionId,
} from '../src/lib/sentio/options/options';

describe('test options', () => {
	it('array export works', () => {
		let arr: any[] = [];
		for (const opt in optionConfigs) {
			if (!optionConfigs.hasOwnProperty(opt)) continue;

			arr.push([opt, optionConfigs[opt as OptionId]]);
		}

		expect(arr).not.toEqual([]);
		expect(arrayOfOptionConfigs).toEqual(arr);
	});
});
