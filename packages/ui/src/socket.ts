import io from 'socket.io-client';

const WS_HOST = process.env.REACT_APP_WS_HOST || 'localhost';
const WS_PORT = process.env.REACT_APP_WS_PORT || 5000;
const socket = io(`http://${WS_HOST}:${WS_PORT}`);

console.log(`Connecting to ${WS_HOST}:${WS_PORT}`);

export default socket;