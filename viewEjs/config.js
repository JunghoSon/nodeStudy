module.exports = {
    server_port: 8083,
    db_url: 'mongodb://localhost:27017/shopping',
    db_schemas: [
        {
            file: './user_schema',
            collection: 'users5',
            schemaName: 'UserSchema',
            modelName: 'UserModel'
        }
    ],
    routes_info: [
        {
            file: './user',
            path: '/process/login',
            method: 'login',
            type: 'post'
        },
        {
            file: './user',
            path: '/process/addUser',
            method: 'addUser',
            type: 'post'
        },
        {
            file: './user',
            path: '/process/listUser',
            method: 'listUser',
            type: 'get'
        }
    ]
};