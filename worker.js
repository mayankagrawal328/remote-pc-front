
const {parentPort} = require('worker_threads')
const total11 = (e) => {
    
    console.log(e[0]);
}



parentPort.on('message', (number) => {
    
    console.log(number[0],number[1]);
    total11(number);
});