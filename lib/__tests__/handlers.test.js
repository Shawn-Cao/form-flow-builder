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
    it('should return undefined without constraints', () => {
        const formSpec = { fields: {
            age: {
                type: 'number'
            }
        }, validate: () => {} };
        expect(validate(formSpec, { age: 300 })).toBeUndefined();
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
        expect(validate(formSpec, { age: 300 }))
            .toEqual(expect.arrayContaining(['max value exceeded'])); // TODO: mock validator returns
        expect(validate(formSpec, { age: -1 }))
            .toEqual(expect.arrayContaining(['min value not reached']));
        expect(validate(formSpec, { age: 10 }))
            .toBeUndefined();
    });
});