"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_client_1 = require("socket.io-client");
const chai_1 = require("chai");
const requestDatas_1 = require("./utils/requestDatas");
describe('process_file event tests', function () {
    let socket;
    beforeEach(function (done) {
        socket = (0, socket_io_client_1.io)('http://localhost:5000');
        socket.on('connect', function () {
            done();
        });
        socket.on('connect_error', function (error) {
            done(error);
        });
    });
    afterEach(function () {
        socket.disconnect();
    });
    it('process_file should trigger run_end event', function (done) {
        const processFileData = (0, requestDatas_1.getBasicProcessFileData)();
        socket.emit('process_file', processFileData);
        socket.once('run_end', (data) => {
            (0, chai_1.expect)(data).to.have.property('output');
            done();
        });
        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });
    it('process_file should trigger progress event', function (done) {
        const processFileData = (0, requestDatas_1.getBasicProcessFileData)();
        socket.emit('process_file', processFileData);
        socket.once('progress', (data) => {
            (0, chai_1.expect)(data).to.have.property('output').to.equal(requestDatas_1.basicJsonFlow[0].inputText);
            (0, chai_1.expect)(data).to.have.property('instance_name').to.equal(requestDatas_1.basicJsonFlow[0].name);
            done();
        });
        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });
    it('process_file should trigger current_node_running event', function (done) {
        const processFileData = (0, requestDatas_1.getBasicProcessFileData)();
        socket.emit('process_file', processFileData);
        socket.once('current_node_running', (data) => {
            (0, chai_1.expect)(data).to.have.property('instance_name').to.equal(requestDatas_1.basicJsonFlow[0].name);
            done();
        });
        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });
    it('process_file with missing input should trigger error event', function (done) {
        const processFileData = (0, requestDatas_1.getJsonFlowWithMissingInputTextProcessFileData)();
        socket.emit('process_file', processFileData);
        socket.once('error', (error) => {
            done();
        });
    });
});
