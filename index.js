const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

var app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 3095;

app.listen(port, () => console.log(`server started at the port: ${port}`));

app.use(express.static(path.join(__dirname, 'frontEnd')));

const censusController = require('./controllers/censusController');
app.use('/api', censusController);
