const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressErrorHandler = require('express-error-handler');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
const route_loader = require('./routes/route_loader');
const config = require('./config');
const database = require('./database/database');
const user = require('./routes/user');

console.log('config.server_port: %d', config.server_port);
app.set('port', process.env.PORT || config.server_port);

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(cookieParser());

//TODO : express-session option 확인
app.use(expressSession({
    secret: 'mySeretKey',
    resave: true,
    saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, 'public')));

route_loader.init(app, config);

const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

app.listen(app.get('port'), () => {
    console.log('Server is running on %d', app.get('port'));
    database.init(app, config);
});