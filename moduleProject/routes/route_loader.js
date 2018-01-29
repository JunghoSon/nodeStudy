const router = require('express').Router();
const route_loader = {};

route_loader.init = (app, config) => {
    let routeLen = config.routes_info.length;

    for(let i=0; i<routeLen; i++){
        let curRoute = config.routes_info[i];

        router[curRoute.type](curRoute.path, require(curRoute.file)[curRoute.method]);
    }

    app.use('/', router);
};

module.exports = route_loader;