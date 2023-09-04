import { io, Socket } from "socket.io-client";
import { expect } from 'chai';

describe('Socket.IO connection tests', function () {

    let socket: Socket;

    before(function (done: Mocha.Done): void {
        socket = io('http://localhost:5000');

        socket.on('connect', function (): void {
            done();
        });

        socket.on('connect_error', function (error: any): void {
            done(error);
        });
    });

    after(function (): void {
        socket.disconnect();
    });

    it('should connect to the server', function (done: Mocha.Done): void {
        expect(socket.connected).to.be.true;
        done();
    });
});