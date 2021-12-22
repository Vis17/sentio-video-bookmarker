// INFO Tests are not complete

import { format } from '../src/lib/puncto';

describe('puncto', () => {
	it('format', () => {
		expect(format(12, 'h:mm:ss')).toBe('0:00:12');
		expect(format(60, 'h:mm:ss')).toBe('0:01:00');
		expect(format(119, 'h:mm:ss')).toBe('0:01:59');
		expect(format(3599, 'h:mm:ss')).toBe('0:59:59');
		expect(format(3600, 'h:mm:ss')).toBe('1:00:00');
		expect(format(86399, 'h:mm:ss')).toBe('23:59:59'); // max :(
	});
});
