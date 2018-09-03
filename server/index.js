const getenv = require('getenv');
getenv.disableFallbacks();
const express = require('express');
const api = require('./api');
const auth = require('./auth');

const app = express();

auth(app);
app.use('/api', api);
app.use(express.static('dist'));

const PORT = getenv('PORT');

app.listen(PORT, () => console.log(`app listening on port ${PORT}`));
