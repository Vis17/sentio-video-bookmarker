import {
	arrayOfOptionConfigs,
	defaultOptions,
	OptionId,
	OptionValue,
} from './options';

export default class OptionsManager {
	private _data!: { [key in OptionId]: OptionValue };

	constructor() {
		// set default
		this.reset();
	}

	private reset() {
		this._data = { ...defaultOptions };
	}

	set(key: OptionId, value: OptionValue) {
		this._data[key] = value;
	}
	get(key: OptionId): OptionValue {
		return this._data[key];
	}

	export(): { [key in OptionId]: OptionValue } {
		return { ...this._data };
	}
	/**
	 * Imports data to the optionManager
	 * @param data The data to import
	 * @param type The type:
	 * * `ignore`: ignore all not given option-names
	 * * `reset`: reset all not given option-names (to their default values)
	 * * `false`: set all not given option-names to false (if type is boolean)
	 */
	import(
		data: { [key in OptionId]?: OptionValue },
		type: 'ignore' | 'reset' | 'false' = 'ignore'
	) {
		if (type === 'reset') this.reset();
		for (const d in data) {
			this._data[d as OptionId] = data[d as OptionId] as OptionValue;
		}
		if (type === 'false') {
			arrayOfOptionConfigs.forEach(option => {
				if (
					!(option[0] in data) &&
					typeof option[1].default === 'boolean'
				)
					this._data[option[0]] = false;
			});
		}
	}
}
