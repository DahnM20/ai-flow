"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const chai_1 = require("chai");
describe('Socket.IO connection tests', function () {
    let socket;
    before(function (done) {
        socket = (0, socket_io_client_1.io)('http://localhost:5000');
        socket.on('connect', function () {
            done();
        });
        socket.on('connect_error', function (error) {
            done(error);
        });
    });
    after(function () {
        socket.disconnect();
    });
    it('should connect to the server', function (done) {
        (0, chai_1.expect)(socket.connected).to.be.true;
        done();
    });
});
