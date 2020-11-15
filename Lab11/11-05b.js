const async = require('async');
const rpcWSC = require('rpc-websockets').Client;

const ws = new rpcWSC('ws://localhost:4000');
let h = (x=ws)=>async.parallel({
    square_3: cb=>{ws.call('square', [3]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});},
    square_5_4: cb=>{ ws.call('square', [5,4]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});},
    sum_2: cb=>{ws.call('sum', [2]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});},
    sum_2_4_6_8_10: cb=>{ws.call('sum', [2,4,6,8,10]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});},
    mul_3: cb=>{ws.call('mul', [3]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});},
    mul_3_5_7_8_11: cb=>{ws.call('mul', [3,5,7,9,11,13]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});},
    fib_7: cb=>{ws.login({login: 'mpg', password: '777'})
        .then(login => {
            if (login) {
                ws.call('fib', [7]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});
            } else {
                cb({message1:'login error'},null);
            }
        })},
    fact_10: cb=>{
        ws.login({login: 'mpg', password: '777'})
        .then(login => {
            if (login) {
                ws.call('fact', [10]).catch((e)=>cb(e,null)).then((r)=>{ cb(null,r)});
            } else {
                cb({message2:'login error'},null);
            }
        })
    }
},
(e, r)=>{
    if(e) console.log('e = ', e);
    else console.log('r = ', r);
    ws.close();
});

ws.on('open',h);