var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Calc = function(){
    this.on('stop', function(){
        console.log('Calc에 stop event 전달함');
    });
};

util.inherits(Calc, EventEmitter);

Calc.prototype.add = function(a, b){
    return a + b;
};

module.exports = Calc;
module.exports.title = 'calculator';

