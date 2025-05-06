/**
 * Fast refereces for constraints 
 */

import { max } from '../validators';

test('max should error on exceeded numbers', () => {
    expect(max(100, 10)).toBe('max value exceeded');
    expect(max(5, 10)).toBeUndefined();
});