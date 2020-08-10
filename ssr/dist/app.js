"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const hbs = require("express-handlebars");
const bodyParser = require("body-parser");
const axios_1 = require("axios");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const ASSET_BUCKET_SERVICE_URL = process.env.ASSET_BUCKET_SERVICE_URL;
let appConfig;
function getSubdomain(host) {
    const subdomain = host ? host.substring(0, host.lastIndexOf('.')) : null;
    return subdomain;
}
const getSubdomainFromHost = (host) => {
    let subdomain = 'stark-corp';
    if (NODE_ENV !== 'local') {
        subdomain = getSubdomain(host);
    }
    console.log('subdomain');
    console.log(subdomain);
    return subdomain;
};
const getConfig = async (subdomain) => {
    const url = ASSET_BUCKET_SERVICE_URL + `/app-config/${subdomain}`;
    console.log('url');
    console.log(url);
    const headers = { "Accept": "application/json" };
    try {
        const result = await axios_1.default.get(url, { headers });
        console.log(result.data);
        appConfig = result.data;
        return result.data;
    }
    catch (error) {
        console.log(error);
    }
};
app.get('/manifest/:subdomain/:filename', async (req, res) => {
    const subdomain = req.params.subdomain;
    const filename = req.params.filename;
    const config = await getConfig(subdomain);
    res.set('Content-Type', 'application/json');
    res.render('manifest', { layout: 'manifest', config: config, assetUrl: ASSET_BUCKET_SERVICE_URL });
});
app.engine('.hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/view/layout/',
    partialsDir: __dirname + '/view/partial/'
}));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', '.hbs');
app.get('/', async (req, res, next) => {
    const subdomain = getSubdomainFromHost(req.headers.host);
    const config = await getConfig(subdomain);
    console.log('config');
    console.log(config);
    res.render('index', { layout: 'main', config: config, assetUrl: ASSET_BUCKET_SERVICE_URL });
});
app.listen(PORT, () => console.log(`App listening to port ${PORT}`));
