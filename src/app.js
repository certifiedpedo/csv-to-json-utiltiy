const express = require('express');
const bodyParser = require('body-parser');
const uploadrouter = require('./routes/upload');

const app = express();
const PORT = process.env.PORT || 3000;
const db = require('../models/index');  


(async () => {
    try {
        console.log(db.sequelize,'sdfdsf')
      await db.sequelize.sync();
      console.log('Database connected successfully.');
    } catch (err) {
      console.error('Unable to connect to the database:', err);
      process.exit(1); // Exit the process if the connection fails
    }
  })();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', uploadrouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});