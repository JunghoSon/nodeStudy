var http = require('http');
var port = 8805;
var server = http.createServer(function(req, res){
    res.writeHead(200, {'Content-Type':'text/plain'});
    res.end('Hello World');
});

server.listen(port, '10.19.1.83');

console.log('Server is running on %d', port);