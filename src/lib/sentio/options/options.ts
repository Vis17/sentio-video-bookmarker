//#region type-defs
/** The key of an Option */
export type OptionId = keyof typeof optionConfigs;
export interface OptionConfigInterface {
	title: string;
	description?: string;

	type: 'checkbox';
	default: OptionValue;
}
/** The value of an Option */
export type OptionValue = boolean;
const asElementTypes = <T>(et: { [K in keyof T]: OptionConfigInterface }) => et;
//#endregion

/** Information about the Option */
const optionConfigs = asElementTypes({
	'page-action-show': {
		type: 'checkbox',
		title: 'Show the "Page - Action"',
		description:
			'This will show an icon in the address-bar in which the videos to bookmark can be selected.',
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
		title: 'Automatically update the time of bookmarked video',
		description:
			'This will update the video-bookmark automatically if you continue to watch',
		default: true,
	},

	'menu-show-video-src': {
		type: 'checkbox',
		title: 'Show the videos src-attribute',
		description:
			'This will show the src-attribute of the videos in the menus.',
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