/**
 * Formats time into a string
 * @param time The amount of time in ms
 * @param format The basic string to format. Can contain
 * * `hh` or `h` for hours
 * * `mm` or `m` for minutes
 * * `ss` or `s` for seconds
 * * `S(S(S)))` (max. 3) for part of seconds (cuttet not rounded!)
 *
 * default format `h:mm:ss:SS`
 * @returns The formatted time
 */
export function format(time: number, format = 'h:mm:ss:SS'): string {
	try {
		if (isNaN(time)) throw new Error('Can`t format NaN');

		const t = new Date(time);
		let out = format;

		out = out.replace('hh', `${t.getUTCHours()}`.padStart(2, '0'));
		out = out.replace('h', `${t.getUTCHours()}`);

		out = out.replace('mm', `${t.getUTCMinutes()}`.padStart(2, '0'));
		out = out.replace('m', `${t.getUTCMinutes()}`);

		out = out.replace('ss', `${t.getUTCSeconds()}`.padStart(2, '0'));
		out = out.replace('s', `${t.getUTCSeconds()}`);

		out = out.replace('SSS', `${t.getUTCMilliseconds()}`.padStart(3, '0'));
		out = out.replace(
			'SS',
			`${t.getUTCMilliseconds()}`.padStart(2, '0').substr(0, 2)
		);
		out = out.replace('S', `${t.getUTCMilliseconds()}`.substr(0, 1));

		return out;
	} catch (err) {
		console.error(err);
		return '...(Error)';
	}
}
