const rpcWSC = require('rpc-websockets').Client;

const ws = new rpcWSC('ws://localhost:4000');
ws.on('open', () => {
    ws.login({login: 'mpg', password: '777'})
        .then(async login => {
            if (login) {
                console.log('result:',
                await ws.call('sum', [
                    await ws.call('square', [3]),
                    await ws.call('square', [5, 4]),
                    await ws.call('mul', [3, 5, 7, 9, 11, 13])]) 
                + await ws.call('fibn', [7])
                * await ws.call('mul', [2, 4, 6])
                )
            } else {
                console.log('login error');
            }
        });
});
ws.on('error', (e)=>{console.log('error = ', e)});