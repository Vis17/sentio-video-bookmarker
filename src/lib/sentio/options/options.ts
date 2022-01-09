//#region type-defs
/** The key of an Option */
export type OptionId = keyof typeof optionConfigs;
interface BaseOptionConfigInterface {
	title: string;
	description?: string;
	permissionsToRequest?: browser._manifest.OptionalPermission[];
}
interface OptionConfigInterfaceString extends BaseOptionConfigInterface {
	default: string;
}
interface OptionConfigInterfaceBoolean extends BaseOptionConfigInterface {
	default: boolean;
}

export type OptionTypeFromId<T extends OptionId> =
	typeof optionConfigs[T]['default'];
export type OptionValuesMapped = {
	[K in keyof typeof optionConfigs]: OptionTypeFromId<K>;
};

export type OptionConfigInterface =
	| (BaseOptionConfigInterface & OptionConfigInterfaceBoolean)
	| OptionConfigInterfaceString;
//#endregion

/**
 * Information about the Option
 *
 * **Options, requesting any `optional_permissions` must always be *opt-in*,
 * so their default value must be `false`!**
 */
const optionConfigs = {
	'page-action-show': <OptionConfigInterfaceBoolean>{
		title: 'Show the "Page - Action"',
		description:
			'This will show an icon in the address-bar in which the videos to bookmark can be selected.',
		default: true,
	},
	'page-auto-reload': <OptionConfigInterfaceBoolean>{
		title: 'Automatically load the videos on the page',
		description:
			'This will automatically reload the videos, visible for SENTIO if you open the popup.',
		default: true,
	},

	'video-auto-load-last-timestamp': <OptionConfigInterfaceBoolean>{
		title: 'Automatically load last timestamp of the video',
		description:
			'This will load the bookmarked timestamp automatically when visiting a site with this video.',
		default: true,
	},
	'video-auto-update-bookmark': <OptionConfigInterfaceBoolean>{
		title: 'Automatically update the timestamp of the bookmarked video',
		description:
			'This will update the video-bookmark automatically if you continue to watch',
		default: true,
	},
	'video-enable-guessing': <OptionConfigInterfaceBoolean>{
		title: 'Enable video guessing',
		description:
			'This will guess a video is the same if their length and URL are the same, even if the source is different. Required for YouTube, ...',
		default: true,
	},
	'video-auto-delete': <OptionConfigInterfaceBoolean>{
		title: 'Enable video bookmark auto delete',
		description:
			'This will delete a video bookmark after a video is watched.',
		default: true,
	},

	'video-manage-browser-bookmark': <OptionConfigInterfaceBoolean>{
		title: 'Create a browser-bookmark when creating a video-bookmark',
		description:
			'This will manage a browser-bookmark next to the video-bookmark. Additional permission is required for this to work.',
		default: false,
		permissionsToRequest: ['bookmarks'],
	},
	'video-browser-bookmark-base': <OptionConfigInterfaceString>{
		title: 'Base string for naming browser-bookmarks',
		description:
			'Take this base-string to build the title of a browser-bookmark. `$title` gets replaced with the actual title of the video-bookmark.',
		default: '$title | Sentio - Video-Bookmark',
	},
	'video-browser-bookmark-folder-name': <OptionConfigInterfaceString>{
		title: 'The name of the folder containing the browser-bookmarks',
		default: 'Sentio | Video-Bookmarks',
		description:
			'The name of the folder, new browser-bookmarks are saved in. Note: Old browser-bookmarks remain in their old folder and have to be moved manually if wished.',
	},

	'menu-show-video-src': <OptionConfigInterfaceBoolean>{
		title: 'Show the videos src-attribute',
		description:
			'This will show the src-attribute of the videos in the menus.',
		default: false,
	},

	'edit-allow-read-only-properties': <OptionConfigInterfaceBoolean>{
		title: 'Allow editing read-only video bookmark properties',
		description:
			'This will allow to edit read-only properties from a video bookmark like the length of the video or the source.',
		default: false,
	},
};

export default optionConfigs;
export const arrayOfOptionConfigs: [OptionId, OptionConfigInterface][] =
	Object.entries(optionConfigs) as [OptionId, OptionConfigInterface][];

const defaultOptObj: Partial<OptionValuesMapped> = {};
arrayOfOptionConfigs.forEach(
	x => ((defaultOptObj[x[0]] as unknown) = x[1].default)
);

/** A object with all options in default-value */
export const defaultOptions: OptionValuesMapped =
	defaultOptObj as OptionValuesMapped;
