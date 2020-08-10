const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });
require('./dist/app.js');