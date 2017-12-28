var result = 0;

console.time('duration_sum');

for(var i=0; i<10000; i++){
    result += i;
}

console.timeEnd('duration_sum');
console.log('1부터 10000까지 더한 값 : %d', result);

console.log('현재 실행중인 파일의 이름 : %s', __filename);
console.log('현재 실행중인 파일의 경로 : %s', __dirname);

var Person = {"name":"Cold Play", "song":"yellow"};
console.dir(Person);