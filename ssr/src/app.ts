import * as express from 'express';
import * as path from 'path';
import * as hbs from 'express-handlebars';
import * as bodyParser from 'body-parser';

import Axios from 'axios';


// App
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;
const ASSET_BUCKET_SERVICE_URL = process.env.ASSET_BUCKET_SERVICE_URL;
let appConfig;

// const staticPath = path.join(__dirname, './', 'public');
// app.use(express.static(staticPath));

function getSubdomain(req) {
    const list = req.subdomains;

    let subdomain = list && list.length > 0 ? list[0] : 'stark-corp'
    if (subdomain.indexOf('www.') !== -1) {
        subdomain = subdomain.substr(subdomain.indexOf(4))
    }

    if (subdomain.indexOf('.') !== -1) {
        subdomain = subdomain.split('.')[0];
    }

    return subdomain;
}

// function getSubdomain(host) {
//     const subdomain = host ? host.substring(0, host.lastIndexOf('.')) : null;
//     return subdomain;
// }

const extractSubdomain = (req) => {
    let subdomain = 'stark-corp';

    if (NODE_ENV !== 'local') {
        subdomain = getSubdomain(req);
    }

    return subdomain;
};


const getConfig = async (subdomain) => {
    const url = ASSET_BUCKET_SERVICE_URL + `/app-config/${subdomain}`;
    console.log('url');
    console.log(url);
    const headers = { "Accept": "application/json" };
    try {
        const result = await Axios.get(url, { headers });
        console.log(result.data);
        appConfig = result.data;
        return result.data;
    } catch (error) {
        console.log(error);
    }

};

// Manifest
app.get('/manifest/:subdomain/:filename', async(req, res) => {

    const subdomain = extractSubdomain(req);
    const config = await getConfig(subdomain);

    // Here we can dynamically generate manifest and serve.
    // Also we can pull data from database
    // I will use a template for simplicity

    // Get config based on subdomain;

    res.set('Content-Type', 'application/json');
    res.render('manifest', {layout: 'manifest', config: config, assetUrl: ASSET_BUCKET_SERVICE_URL});
});

// view engine setup

app.engine('.hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/view/layout/',
    partialsDir: __dirname + '/view/partial/'
}));
app.set('views', path.join(__dirname, 'view'));
app.set('view engine', '.hbs');

app.get('/', async (req, res, next) => {
    
    // const subdomain = extractSubdomain(req.headers.host);
    const subdomain = extractSubdomain(req);
    const config = await getConfig(subdomain);

    console.log('subdomain');
    console.log(subdomain);
    console.log('config');
    console.log(config);

    res.render('index', {layout: 'main', config: config, assetUrl: ASSET_BUCKET_SERVICE_URL});
});

app.listen(PORT, () => console.log(`App listening to port ${PORT}`));
