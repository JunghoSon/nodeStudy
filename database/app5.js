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

router.post('/process/login', (req, res) => {
    let id = req.body.id;
    let pw = req.body.password;

    if(database){
        authUser(database, id, pw, (err, docs) => {
            if(err) throw err;

            if(docs){
                console.dir(docs);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>아이디: ' + id + '</p></div>');
                res.write('<div><p>패스워드: ' + pw + '</p></div>');
                res.write('<a href="/login.html">다시 로그인하기.</a>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<div><p>아이디와 비밀번호를 확인해주세요.</p></div>');
                res.write('<a href="/login.html">다시 로그인하기.</a>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.post('/process/addUser', (req, res) => {
    let id = req.body.id;
    let pw = req.body.password;
    let name = req.body.name;

    if(mongoose.connection){
        addUser(database, id, pw, name, (err, result) => {
            if(err) throw err;

            if(result){
                console.dir(result);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 성공</h1>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>사용자 추가 실패</h1>');
                res.end();
            }
        });
    }else{
        res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
        res.write('<h2>데이터베이스 연결 실패</h2>');
        res.write('<div><p>데이터베이스에 연결하지 못했습니다.</p></div>');
        res.end();
    }
});

router.post('/process/listUser', (req, res) => {
    console.log('/process/listUser 호출됨.');

    if(mongoose.connection){
        UserModel.findAll((err, results) => {
            if(err) throw err;

            if(results){
                console.dir(results);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<ul>');

                for(var i=0; i< results.length; i++){
                    res.write('<li>');
                    res.write('#' + i + ' : ' + results[i]._doc.id + ' / ' + results[i]._doc.name);
                    res.write('</li>');
                }

                res.write('</ul>');
                res.end();
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>사용자 리스트 조회 실패</h1>');
                res.end();
            }
        });
    }
});

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

    // mongoose.connect(databaseURL, opts, err => {
    //     if(err) throw err;
    //
    //     console.log('데이터베이스에 연결되었습니다 : %s', databaseURL);
    //
    //     UserSchema = mongoose.Schema({
    //         id: {type: String, required: true, unique: true},
    //         password: {type: String, required: true},
    //         name: {type: String, index: 'hashed'},
    //         age: {type: Number, default: -1},
    //         created_at: {type: Date, index: {unique: false, expired: '1d'}},
    //         updated_at: Date
    //     });
    //
    //     UserSchema.static('findById', (id, callback) => {
    //         return this.find({id: id}, callback);
    //     });
    //
    //     UserSchema.static('findAll', (callback) => {
    //         return this.find({}, callback);
    //     });
    //
    //     UserModel = mongoose.model('users2', UserSchema);
    //     console.log('users2 정의함.');
    // });

    //mongoose.Promise = Promise;

    // mongoose.connect(databaseURL, opts).then(
    //     () => {
    //         console.log('데이터베이스에 연결되었습니다 : %s', databaseURL);
    //
    //         UserSchema = mongoose.Schema({
    //             id: {type: String, required: true, unique: true},
    //             password: {type: String, required: true},
    //             name: {type: String, index: 'hashed'},
    //             age: {type: Number, default: -1},
    //             created_at: {type: Date, index: {unique: false, expired: '1d'}},
    //             updated_at: Date
    //         });
    //
    //         UserSchema.static('findById', (id, callback) => {
    //             return this.find({id: id}, callback);
    //         });
    //
    //         UserSchema.static('findAll', (callback) => {
    //             return this.find({}, callback);
    //         });
    //
    //         UserModel = mongoose.model('users2', UserSchema);
    //         console.log('users2 정의함.');
    //     },
    //
    //     err => {
    //         console.log('mongoose connection error.');
    //     }
    // );

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
    UserSchema = mongoose.Schema({
        id: {type: String, required: true, unique: true, default: ' '},
        hashed_password: {type: String, required: true, default: ' '},
        salt: {type: String, required: true},
        name: {type: String, index: 'hashed', default: ' '},
        age: {type: Number, default: -1},
        created_at: {type: Date, index: {unique: false}, default: Date.now},
        updated_at: {type: Date, index: {unique: false}, default: Date.now}
    });

    UserSchema
        .virtual('password')
        .set(function(password){
            this._password = password;
            this.salt = this.makeSalt();
            this.hashed_password = this.encryptPassword(password);

            console.log('virtual password 호출됨: ' + this.hashed_password);
        })
        .get(function(){
            return this._password;
        });

    UserSchema.method('encryptPassword', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha1', inSalt).update(plainText).digest('hex');
        }else{
            return crypto.createHmac('sha1', this.salt).update(plainText).digest('hex');
        }
    });

    UserSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())) + '';
    });

    UserSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);

            return this.encryptPassword(plainText, inSalt) === hashed_password;
        }else{
            console.log('authenticate 호출됨 : %s -> %s : %s', plainText, this.encryptPassword(plainText), this.hashed_password);

            return this.encryptPassword(plainText) === this.hashed_password;
        }
    });

    UserSchema.path('id').validate(function(id){
        return id.length;
    }, 'id 칼럼의 값이 없습니다.');

    UserSchema.path('name').validate(function(name){
        return name.length;
    }, 'name 칼럼의 값이 없습니다.');

    UserSchema.static('findById', function(id, callback){
        return this.find({id: id}, callback);
    });

    UserSchema.static('findAll', function(callback){
        return this.find({}, callback);
    });

    UserModel = mongoose.model('users5', UserSchema);
    console.log('users5 정의함.');
};

const authUser = (database, id, pw, callback) => {
    console.log('authUser 호출됨.');

    UserModel.findById(id, (err, results) => {
        if(err){
            callback(err, null);
            return;
        }

        console.log('아이디 [%s]로 사용자 검색 결과', id);
        console.dir(results);

        if(results.length > 0) {
            console.log('아이디 일치하는 사용자를 찾음');

            let user = new UserModel({id: id});
            let authenticated = user.authenticate(pw, results[0]._doc.salt, results[0]._doc.hashed_password);

            if(authenticated){
                console.log('비밀번호가 일치함');
                callback(null, results);
            }else{
                console.log('비밀번호가 일치하지 않음');
                callback(null, null);
            }
        }else{
            console.log('일치하는 사용자를 찾지 못함');
            callback(null, null);
        }
    });
};

const addUser = (database, id, pw, name, callback) => {
    console.log('addhUser 호출됨.');

    let user = new UserModel({
        id: id,
        password: pw,
        name: name
    });

    user.save(err => {
        if(err){
            callback(err, null);
            return;
        }

        console.log('사용자 데이터 추가함');
        callback(null, user);
    });
};

app.listen(app.get('port'), () => {
    console.log('Server is running on %d', app.get('port'));

    connectDB();
});