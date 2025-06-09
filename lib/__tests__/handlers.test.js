import { mergeErrors } from '../handlers';
import { validate } from '../handlers';

// TODO: error reporting should probabaly come with field name in future
test('mergeErrors reducer should merge error to array', () => {
    expect([].reduce(mergeErrors, [])).toEqual([]);
    expect(['an error'].reduce(mergeErrors, []))
        .toEqual(['an error']);
    expect([undefined, 'error 1', undefined, 'error 2'].reduce(mergeErrors, []))
        .toEqual(['error 1', 'error 2']);
});

describe('validate handler', () => {
    it('should return empty object without constraints', () => {
        const formSpec = { fields: {
            age: {
                type: 'number'
            }
        }, validate: () => {} };
        expect(validate(formSpec, { age: 300 })).toEqual({});
    });
    it('should return errors as array with constraints', () => {
        const formSpec = { fields: {
            age: {
                type: 'number',
                constraints: {
                    min: 0,
                    max: 200,
                }
            }
        }, validate: () => {} };
        // TODO: mock validator returns
        expect(validate(formSpec, { age: 300 })).toEqual({ age: 'max value exceeded' });
        expect(validate(formSpec, { age: -1 })).toEqual({ age: 'min value not reached' });
        expect(validate(formSpec, { age: 10 })).toEqual({});
    });
});