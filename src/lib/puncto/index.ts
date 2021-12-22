/**
 * Formats time into a string
 * @param time The amount of time in seconds
 * @param format The basic string to format. Can contain
 * * `hh` or `h` for hours
 * * `mm` or `m` for minutes
 * * `ss` or `s` for seconds
 *
 * default format `h:mm:ss`
 * @returns The formatted time
 */
export function format(time: number, format = 'h:mm:ss'): string {
	try {
		if (isNaN(time)) throw new Error('Can`t format NaN');

		const t = new Date(time * 1000);
		let out = format;

		out = out.replace('hh', `${t.getUTCHours()}`.padStart(2, '0'));
		out = out.replace('h', `${t.getUTCHours()}`);

		out = out.replace('mm', `${t.getUTCMinutes()}`.padStart(2, '0'));
		out = out.replace('m', `${t.getUTCMinutes()}`);

		out = out.replace('ss', `${t.getUTCSeconds()}`.padStart(2, '0'));
		out = out.replace('s', `${t.getUTCSeconds()}`);

		return out;
	} catch (err) {
		console.error(err);
		return '...(Error)';
	}
}
