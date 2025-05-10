import { initializeData, orderFields } from '../form-router';

describe('orderfields', () => {
    it('should transform fields from ordered object fields to array', () => {
        const formSpec = { fields: {
            name: {
                type: 'string',
            },
            age: {
                type: 'number'
            },
            gender: {}
        }};
        expect(orderFields(formSpec)).toEqual([
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

describe('initializeData', () => {
    it('should initialize data to empty object when initial data is not passed', () => {
        const formSpec = { fields: {
            age: {
                type: 'number'
            },
        }};
        expect(initializeData(formSpec)).toEqual({});
    })
    it('should take defaultValue when initial data is not passed', () => {
        const formSpec = { fields: {
            age: {
                type: 'number',
                defaultValue: 10,
            },
        }};
        expect(initializeData(formSpec)).toEqual({ age: 10 });
    })
    it('should keep initial data whenever field is passed in', () => {
        const formSpec = { fields: {
            age: {
                type: 'number',
                defaultValue: 10,
            },
            name : {
                type: 'string',
            }
        }};
        expect(initializeData(formSpec, { age: 50, name: 'John Doe' }))
            .toEqual({ age: 50, name: 'John Doe' });
    })
});
