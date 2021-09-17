/**
 * Setup single sails socket instance
 */
import { baseUrl } from '../pages/config'
// import { Socket } from 'socket.io-client';
// import SailsIOJS from 'sails.io.js';

function initilizeSocket() {
    if (document.io) return;
    var socketIOClient = require('socket.io-client');
    var sailsIOClient = require('sails.io.js');

    // Instantiate the socket client (`io`)
    // (for now, you must explicitly pass in the socket.io client when using this library from Node.js)
    var io = sailsIOClient(socketIOClient);
    document.io = io;
    // io.sails.autoConnect = false;
    io.sails.url = baseUrl;
    io.sails.rejectUnauthorized = false;
    io.sails.reconnection = true;
    io.sails.headers = {
        'x-auth-token': window.localStorage.getItem('token')
    };

    io.socket.on('connect', () => {
        io.socket.post('/message/subscribe', {}, (res, jwr) => {
            console.log('Possibly Joined room')
        });
    });


}
initilizeSocket()

const addEventListener = (name, func) => {
    console.log('listening on ' + name)
    // func()
    document.io.socket.on(name, func)
}

const removeEventListener = (name, func) => {
    console.log('remove listeners on ' + name)
    document.io.socket.off(name, func)
}

const reconfigToken = () => {
    let { io } = document;
    if (!io.socket.isConnected()) return

    io.socket.disconnect();
    io.sails.headers = {
        'x-auth-token': window.localStorage.getItem('token')
    };
    io.socket.reconnect();
}


const disconnectSocket = () => {
    const { io } = document;
    if (!io.socket.isConnected()) return;
    io.socket.disconnect();
}

const connectSocket = () => {
    const { io } = document;
    if (io.socket.isConnected() || io.socket.isConnecting()) return;
    io.sails.headers = {
        'x-auth-token': window.localStorage.getItem('token')
    };
    io.socket.reconnect();
}

let obj = {
    addEventListener,
    removeEventListener,
    reconfigToken,
    disconnectSocket,
    connectSocket
}

export { addEventListener, reconfigToken, removeEventListener };
export default obj;
