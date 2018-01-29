const mongoose = require('mongoose');

const database = {};

database.init = (app, config) => {
    console.log('init() 호출됨');

    connect(app, config);
};

const connect = (app, config) => {
    let opts = {
        useMongoClient: true,
        autoReconnect: false,
        autoIndex: false
    };

    let db = mongoose.connection;

    db.on('error', console.error.bind(console, 'mongoose connection error.'));

    db.on('open', () => {
        console.log('데이터베이스에 연결되었습니다 : %s', config.db_url);

        createSchema(app, config);
    });

    db.on('disconnected', connect);

    mongoose.connect(config.db_url, opts);
};

const createSchema = (app, config) => {
    let schemaLen = config.db_schemas.length;
    console.log('설정에 정의된 스키마의 수: %d', schemaLen);

    for(let i=0; i<schemaLen; i++){
        let curItem = config.db_schemas[i];

        let curSchema = require(curItem.file).createSchema(mongoose);
        console.log('%s 모듈을 불러들인 후 스키마 정의함.', curItem.file);

        let curModel = mongoose.model(curItem.collection, curSchema);
        console.log('%s 컬렉션을 위해 모델 정의함.', curItem.collection);

        database[curItem.modelName] = curModel;
        console.log('스키마 이름 [%s], 모델 이름 [%s]이 database 객체의 속성으로 추가됨.', curItem.schemaName, curItem.modelName);
    }

    app.set('database', database);
    console.log('database 객체가 app 객체의 속성으로 추가됨.');
};

module.exports = database;