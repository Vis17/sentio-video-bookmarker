//#region type-defs
/** The key of an Option */
export type OptionId = keyof typeof optionConfigs;
export interface OptionConfigInterface {
	title: string;
	description?: string;

	type: 'checkbox';
	default: OptionValue;

	permissionsToRequest?: browser._manifest.OptionalPermission[];
}
/** The value of an Option */
export type OptionValue = boolean;
const asElementTypes = <T>(et: { [K in keyof T]: OptionConfigInterface }) => et;
//#endregion

/**
 * Information about the Option
 *
 * **Options, requesting any `optional_permissions` must always be *opt-in*,
 * so their default value must be `false`!**
 */
const optionConfigs = asElementTypes({
	'page-action-show': {
		type: 'checkbox',
		title: 'Show the "Page - Action"',
		description:
			'This will show an icon in the address-bar in which the videos to bookmark can be selected.',
		default: true,
	},
	'page-auto-reload': {
		type: 'checkbox',
		title: 'Automatically load the videos on the page',
		description:
			'This will automatically reload the videos, visible for SENTIO if you open the popup.',
		default: true,
	},

	'video-auto-load-last-timestamp': {
		type: 'checkbox',
		title: 'Automatically load last timestamp of the video',
		description:
			'This will load the bookmarked timestamp automatically when visiting a site with this video.',
		default: true,
	},
	'video-auto-update-bookmark': {
		type: 'checkbox',
		title: 'Automatically update the timestamp of the bookmarked video',
		description:
			'This will update the video-bookmark automatically if you continue to watch',
		default: true,
	},
	'video-enable-guessing': {
		type: 'checkbox',
		title: 'Enable video guessing',
		description:
			'This will guess a video is the same if their length and URL are the same, even if the source is different. Required for YouTube, ...',
		default: true,
	},
	'video-create-bookmark': {
		type: 'checkbox',
		title: 'Create a browser-bookmark when creating a video-bookmark',
		description:
			'This will manage a browser-bookmark next to the video-bookmark. Additional permission is required for this to work.',
		default: false,
		permissionsToRequest: ['bookmarks'],
	},

	'menu-show-video-src': {
		type: 'checkbox',
		title: 'Show the videos src-attribute',
		description:
			'This will show the src-attribute of the videos in the menus.',
		default: false,
	},

	'edit-allow-read-only-properties': {
		type: 'checkbox',
		title: 'Allow editing read-only video bookmark properties',
		description:
			'This will allow to edit read-only properties from a video bookmark like the length of the video or the source.',
		default: false,
	},
});

export default optionConfigs;
export const arrayOfOptionConfigs: [OptionId, OptionConfigInterface][] =
	Object.entries(optionConfigs) as [OptionId, OptionConfigInterface][];

const defaultOptObj: { [key in OptionId]?: OptionValue } = {};
arrayOfOptionConfigs.forEach(x => (defaultOptObj[x[0]] = x[1].default));

/** A object with all options in default-value */
export const defaultOptions: { [key in OptionId]: OptionValue } =
	defaultOptObj as { [key in OptionId]: OptionValue };
