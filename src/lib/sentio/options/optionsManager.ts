import {
	arrayOfOptionConfigs,
	defaultOptions,
	OptionId,
	OptionValue,
} from './options';

export default class OptionsManager {
	// REVIEW use a Map?
	private _data!: { [key in OptionId]: OptionValue };

	constructor() {
		// initialize
		this.reset(false);

		// override defaults if possible
		this.load();
	}

	/**
	 * Resets the option-data.
	 * @param save Determines whether or not the data should be saved. Deafaults to `true`.
	 */
	private reset(save = true) {
		this._data = { ...defaultOptions };

		if (save) this.save();
	}

	set(key: OptionId, value: OptionValue) {
		this._data[key] = value;

		this.save();
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

		this.save();
	}

	/**
	 * Saves the option-data to the local extension storage.
	 *
	 * Should be called after each modification.
	 */
	async save(): Promise<void> {
		browser.storage.local.set({ options: this.export() });
	}
	/** Loads the option-data from the local extension storage and tries to import the data */
	async load(): Promise<void> {
		try {
			this.import(
				(await browser.storage.local.get('options'))?.['options']
			);
		} catch (error) {
			// console.error(error);
		}
	}
}
