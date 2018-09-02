const express = require('express');
const api = require('./api');

const app = express();

app.use('/api', api);
app.use(express.static('dist'));

app.listen(3000, () => console.log('app listening on port 3000'));
