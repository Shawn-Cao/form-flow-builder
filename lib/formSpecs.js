// # TODO: rename to form something?

// # example data (parsed), in data format
// Object keys aligns better with human perception, in that
//   1. fields (names) are unique
//   2. data become the same object format, and are easier to read
// const formSpec = {
//     fields: {
//         name: {
//             type: 'string',
//         },
//         age: {
//             type: 'integer',
//             constraints: {
//                 min: 0,
//                 max: 200,
//             }
//         },
//         gender: {
//             type: 'string',
//             options: ['male', 'female', 'other'],
//         }
//     },
// };
// also simpler format, which can be transformed to above before passing to builder:
const formSpec = ['name', 'age', 'gender']


export function builder(data, ui) {
    data.fields.forEach(field => {
        ui.bootstrap();
        ui.appendChild(field);
    });
    // return theUI; # or undefined?
}

// TODO: do I still need this?