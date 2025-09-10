import { initializeData, denormalize, customReferenceEvaluation, merge } from '../form-spec-helper';

describe('denormalize', () => {
    it('should transform fields from ordered object fields to array', () => {
        const formSpec = {
            name: {
                type: 'string',
            },
            age: {
                type: 'number'
            },
            gender: {}
        };
        expect(denormalize(formSpec)).toEqual([
            {
                name: 'name',
                type: 'string',
            },
            {
                name: 'age',
                type: 'number'
            },
            {
                name: 'gender'
            }
        ]);
    });
});

// ...existing code...

describe('custom DSL Reference Evaluation function', () => {
    const formData = { age: 25, name: 'John', years: 25, empty: '' };
    const testCases = [
        ['non-empty string reference', '$name', true],
        ['non-empty string reference after NOT(!)', '!$name', false],
        ['empty string reference', '$empty', false],
        ['empty string reference after NOT(!)', '!$empty', true],
        ['equality test between reference and number value', '$age == 25', true],
        ['equality test between reference and string value', '$name == John', true],
        ['equality test between reference and reference', '$age == $years', true],
        ['failed equality test between reference and value', '$year == NotANumber', false],
        ['iequality test between reference and value', '$name != Jane', true],
        ['iequality test between reference and reference', '$name != $years', true],
        ['iequality test between reference and reference', '$age != $years', false],
    ];

    testCases.forEach(([caseName, expression, result]) => {
        it(`should return ${result} for ${caseName}, eg. "${expression}"`, () => {
            expect(customReferenceEvaluation(expression, formData)).toEqual(result);
        });
    });
});

describe('initializeData', () => {
    it('should initialize data to empty object when initial data is not passed', () => {
        const formSpec = {
            fields: {
                age: {
                    type: 'number'
                },
            }
        };
        expect(initializeData(formSpec)).toEqual({});
    })
    it('should take defaultValue when initial data is not passed', () => {
        const formSpec = {
            fields: {
                age: {
                    type: 'number',
                    defaultValue: 10,
                },
            }
        };
        expect(initializeData(formSpec)).toEqual({ age: 10 });
    })
    it('should keep initial data whenever field is passed in', () => {
        const formSpec = {
            fields: {
                age: {
                    type: 'number',
                    defaultValue: 10,
                },
                name: {
                    type: 'string',
                }
            }
        };
        expect(initializeData(formSpec, { age: 50, name: 'John Doe' }))
            .toEqual({ age: 50, name: 'John Doe' });
    })
});

describe('merge', () => {
    it('should handle null target gracefully', () => {
        const source = { a: 1 };
        expect(merge(null, source)).toEqual({ a: 1 });
    });
    it('should handle null source gracefully', () => {
        const target = { a: 1 };
        expect(merge(target, null)).toEqual(target);
    });
    it('should deeply merge two plain objects', () => {
        const target = { a: 1, b: { c: 2 } };
        const source = { b: { d: 3 }, e: 4 };
        expect(merge({ ...target }, source)).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });
    it('should also support 2+ levels deep merge', () => {
        const target = { a: { b: { c: 3 } } };
        const source = { a: { b: { d: 4 } } };
        expect(merge({ ...target }, source)).toEqual({ a: { b: { c: 3, d: 4 } } });
    });
    it('should merge arrays by reference (not deep merge)', () => {
        const target = { arr: [1, 2] };
        const source = { arr: [3, 4] };
        // merge does not merge arrays, it replaces by reference
        expect(merge({ ...target }, source)).toEqual({ arr: [3, 4] });
    });
    it('should merge arrays by reference as example of handling delete', () => {
        const target = { arr: [1, 2, 3, 4] };
        const source = { arr: [1, 3, 4] };
        // merge does not merge arrays, it replaces by reference
        expect(merge({ ...target }, source)).toEqual({ arr: [1, 3, 4] });
    });
    it('should not mutate source object', () => {
        const target = { a: 1 };
        const source = { b: { c: 2 } };
        const sourceCopy = JSON.parse(JSON.stringify(source));
        merge({ ...target }, source);
        expect(source).toEqual(sourceCopy);
    });
    it('should merge nested objects with arrays inside', () => {
        const target = { a: { b: [1, 2] } };
        const source = { a: { b: [3, 4], c: 5 } };
        expect(merge({ ...target }, source)).toEqual({ a: { b: [3, 4], c: 5 } });
    });
    it('should handle undefined target and source', () => {
        expect(merge(undefined, undefined)).toBeUndefined();
    });
    it('should handle merging when both target and source are empty objects', () => {
        expect(merge({}, {})).toEqual({});
    });
})