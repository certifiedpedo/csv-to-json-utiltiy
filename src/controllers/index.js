const fs = require('fs');
const csv = require('csv-parser');
const { processCSVData, userJsonMapper } = require('../utils/helpers');
// This file exports a controller function that handles specific routes for the application.
const db=    require('../../models/index') // Assuming you have a User model defined
exports.handleUpload = (req, res) => {
    // Logic for handling the uploaded CSV file will go here
   
if (!req.file || !req.file.path) {
    return res.status(400).send('No file uploaded');
}

const headers = [];
if (req.file.mimetype !== 'text/csv') {
    return res.status(400). send('Uploaded file must be a CSV');
}
const columns = [];

fs.createReadStream(req.file.path)
    .pipe(csv())        
    .on('headers', (headerRow) => {
        headers.push(...headerRow);
    })
    .on('data', (row) => {
        columns.push(row);
    })
    .on('end', async () => {
        try {
            const { processedHeaders, processedData } = processCSVData(headers, columns);
          
          
           
            // Insert the processed data into the database  
            const userPromises = processedData.map((user) => {
                console.log('Processed User:', user);
                const userJson = userJsonMapper(user);
                return db.User.create(userJson);
            });
        
            // Use Promise.allSettled to handle all insertions concurrently
            const results = await Promise.allSettled(userPromises);
        
            // Log any errors from the insertions
            results.forEach((result, index) => {
                if (result.status === 'rejected') {
                    console.error(`Error inserting user at index ${index}:`, result.reason);
                }
            });

            const totalUsers = await db.User.count();
            const ageGroups = {
                '< 20': await db.User.count({ where: { age: { [db.Sequelize.Op.lt]: 20 } } }),
                '20 to 40': await db.User.count({
                    where: { age: { [db.Sequelize.Op.between]: [20, 40] } },
                }),
                '40 to 60': await db.User.count({
                    where: { age: { [db.Sequelize.Op.between]: [40, 60] } },
                }),
                '> 60': await db.User.count({ where: { age: { [db.Sequelize.Op.gt]: 60 } } }),
            };

            // Calculate percentage distribution
            const ageDistribution = {};
            for (const [group, count] of Object.entries(ageGroups)) {
                ageDistribution[group] = ((count / totalUsers) * 100).toFixed(2); // Percentage
            }

            // Print the report
            console.log('Age-Group % Distribution');
            for (const [group, percentage] of Object.entries(ageDistribution)) {
                console.log(`${group}: ${percentage}%`);
            }

             
       

            res.json({ processedHeaders, processedData });
        } catch (error) {
            console.error('Error saving data to the database:', error);
            res.status(500).send('Error saving data to the database');
        }
    })  
    .on('error', (err) => {
        res.status(500).send('Error processing CSV file');
    });
};  