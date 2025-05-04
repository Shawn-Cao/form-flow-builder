// # TODO: rename to form something?

// # example data (parsed), in data format
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
//     }
// };


export function builder(data, ui) {
    data.fields.forEach(field => {
        ui.bootstrap();
        ui.appendChild(field);
    });
    // return theUI; # or undefined?
}


