import { Socket, io } from "socket.io-client";

let socket: Socket;

export const setupSocket = (done: any) => {
    socket = io('http://localhost:5000');

    socket.on('connect', function () {
        done();
    });

    socket.on('connect_error', function (error) {
        done(error);
    });
};

export const disconnectSocket = () => {
    socket.disconnect();
};

export const getSocket = () => socket;
