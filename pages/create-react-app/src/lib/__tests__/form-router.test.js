import { orderFields } from '../form-router';

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