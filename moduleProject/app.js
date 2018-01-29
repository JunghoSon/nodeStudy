const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const expressErrorHandler = require('express-error-handler');
const mongoose = require('mongoose');
const crypto = require('crypto');

const app = express();
const router = express.Router();
const user = require('./routes/user');

let database = null;
let UserSchema;
let UserModel;

app.set('port', process.env.PORT || 8083);

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

router.post('/process/login', user.login);
router.post('/process/addUser', user.addUser);
router.get('/process/listUser', user.listUser);
app.use('/', router);

const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

const connectDB = () => {
    let databaseURL = 'mongodb://localhost:27017/shopping';
    let opts = {
        useMongoClient: true,
        autoReconnect: false,
        autoIndex: false
    };

    database = mongoose.connection;

    database.on('error', console.error.bind(console, 'mongoose connection error.'));

    database.on('open', () => {
        console.log('데이터베이스에 연결되었습니다 : %s', databaseURL);

        createUserSchema();
    });

    database.on('disconnected', connectDB);

    mongoose.connect(databaseURL, opts);
};

const createUserSchema = () => {
    UserSchema = require('./database/user_schema').createSechema(mongoose);

    UserModel = mongoose.model('users5', UserSchema);
    console.log('UserModel 정의함.');

    user.init(database, UserSchema, UserModel);
};

app.listen(app.get('port'), () => {
    console.log('Server is running on %d', app.get('port'));
    connectDB();
});