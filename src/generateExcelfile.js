const xlsx = require('xlsx');
const { faker } = require('@faker-js/faker'); // Ensure @faker-js/faker is installed

// Generate 5000 rows of data
const rows = [];
for (let i = 0; i < 5000; i++) {
  rows.push({
    'name.firstName': faker.person.firstName(),
    'name.lastName': faker.person.lastName(),
    'address.line1': faker.location.streetAddress(),
    'address.line2': faker.location.secondaryAddress(),
    'address.line3': faker.location.city(),
    'additional_info.meta.preference': faker.lorem.sentence(), // Random sentence as additional info
    gender: faker.person.sex(), // Generates "male", "female", etc.
    age: faker.number.int({ min: 18, max: 80 }), // Random age between 18 and 80
  });
}

// Create a worksheet from the data
const worksheet = xlsx.utils.json_to_sheet(rows);

// Create a new workbook and append the worksheet
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

// Write the workbook to a file
xlsx.writeFile(workbook, 'users.xlsx');

console.log('Excel file "users.xlsx" has been created with 5000 rows.');