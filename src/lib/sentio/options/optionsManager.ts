import {
	arrayOfOptionConfigs,
	defaultOptions,
	OptionId,
	OptionTypeFromId,
	OptionValuesMapped,
} from './options';

export default class OptionsManager {
	// REVIEW use a Map?
	private _data!: OptionValuesMapped;

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

	set<T extends OptionId>(key: T, value: OptionValuesMapped[T]) {
		this._data[key] = value;

		this.save();
	}
	get<T extends OptionId>(key: T): OptionTypeFromId<T> {
		return this._data[key];
	}

	export(): OptionValuesMapped {
		return { ...this._data };
	}
	/**
	 * Imports data to the optionManager
	 * @param data The data to import
	 * @param type The type:
	 * * `ignore`: ignore all not given option-names
	 * * `reset`: reset all not given option-names (to their default values)
	 * * `false`: set all not given option-names to false (if type is boolean)
	 * @returns The permissions to request from the user, based on their saved options.
	 * *No check whether they are already granted or not.*
	 */
	import(
		data: Partial<OptionValuesMapped>,
		type: 'ignore' | 'reset' | 'false' = 'ignore'
	): Set<browser._manifest.OptionalPermission> {
		if (type === 'reset') this.reset();
		for (const d in data) {
			(this._data[d as OptionId] as unknown) = data[d as OptionId];
		}
		if (type === 'false') {
			arrayOfOptionConfigs.forEach(option => {
				if (
					!(option[0] in data) &&
					typeof option[1].default === 'boolean'
				)
					(this._data[option[0]] as unknown) = false;
			});
		}

		this.save();

		// return permissions that should be requested
		const permissionsToRequest: Set<browser._manifest.OptionalPermission> =
			new Set();
		arrayOfOptionConfigs.forEach(option => {
			if (option[1].permissionsToRequest && data?.[option[0]] === true)
				option[1]?.permissionsToRequest?.forEach?.(x =>
					permissionsToRequest.add(x)
				);
		});

		return permissionsToRequest;
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
	/** Clears the extion´s options storage */
	clear() {
		this.reset(false);
		return browser.storage.local.remove('options');
	}
}
