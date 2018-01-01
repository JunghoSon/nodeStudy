process.on('tick', function(){
    console.log('tick 이벤트 발생');
});

setTimeout(function(){
    console.log('2초 후에 tick 이벤트 전달 시도');

    process.emit('tick');
}, 2000);

