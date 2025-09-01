import { initializeData, denormalize, customReferenceEvaluation } from '../form-spec-helper';

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
    // it('should return false for empty string when no comparison', () => {
    //     expect(customReferenceEvaluation('empty', formData)).toBe(false);
    // });

    // it('should compare equality for == operator with numbers', () => {
    //     expect(customReferenceEvaluation('age==25', formData)).toBe(true);
    // });

    // it('should compare equality for == operator with fields', () => {
    //     expect(customReferenceEvaluation('age==year', formData)).toBe(true);
    // });

    // it('should compare inequality for == operator with fields', () => {
    //     expect(customReferenceEvaluation('age==name', formData)).toBe(true);
    // });

    // it('should trim $ from field names', () => {
    //     const fn = customReferenceEvaluation('$age==25');
    //     expect(fn(formData)).toBe(true);
    // });
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
