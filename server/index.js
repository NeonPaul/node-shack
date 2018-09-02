const getenv = require('getenv');
const express = require('express');
const api = require('./api');

const app = express();

app.use('/api', api);
app.use(express.static('dist'));

getenv.disableFallbacks();

const PORT = getenv('PORT');

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
