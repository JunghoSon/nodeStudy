const login = (req, res) => {
    console.log('user 모듈 안에 있는 login 호출됨.');

    let database = req.app.get('database');
    let id = req.body.id;
    let pw = req.body.password;

    if(database){
        authUser(database, id, pw, (err, docs) => {
            if(err) throw err;

            if(docs){
                console.dir(docs);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                // res.write('<h1>로그인 성공</h1>');
                // res.write('<div><p>아이디: ' + id + '</p></div>');
                // res.write('<div><p>패스워드: ' + pw + '</p></div>');
                // res.write('<a href="/login.html">다시 로그인하기.</a>');
                // res.end();

                let context = {userid: id, userpassword: pw};
                req.app.render('login_success', context, (err, html) => {
                    if(err) throw err;
                    console.log('rendered: ' + html);
                    res.end(html);
                });
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
};

const addUser = (req, res) => {
    console.log('user 모듈 안에 있는 addUser 호출됨.');

    let database = req.app.get('database');
    let id = req.body.id;
    let pw = req.body.password;
    let name = req.body.name;

    if(database){
        addUsers(database, id, pw, name, (err, result) => {
            if(err) throw err;

            if(result){
                console.dir(result);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                req.app.render('add_user', {title: '사용자 추가 성공'}, (err, html) => {
                    if(err) throw err;

                    console.log('rendered: ', html);

                    res.end(html);
                });
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
};

const listUser = (req, res) => {
    console.log('user 모듈 안에 있는 listUser 호출됨.');

    let database = req.app.get('database');
    let UserModel = database.UserModel;

    if(database){
        UserModel.findAll((err, results) => {
            if(err) throw err;

            if(results){
                console.dir(results);

                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});

                req.app.render('list_user', {results: results}, (err, html) => {
                    if(err) throw err;

                    console.log('rendered : ', html);

                    res.end(html);
                });
            }else{
                res.writeHead(200, {'Content-Type': 'text/html;charset=utf8'});
                res.write('<h1>사용자 리스트 조회 실패</h1>');
                res.end();
            }
        });
    }
};

const authUser = (database, id, pw, callback) => {
    console.log('authUser 호출됨.');

    let UserModel = database.UserModel;

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

const addUsers = (database, id, pw, name, callback) => {
    console.log('addhUser 호출됨.');

    let user = new database.UserModel({
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

module.exports.login = login;
module.exports.addUser = addUser;
module.exports.listUser = listUser;

