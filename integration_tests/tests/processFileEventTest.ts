import { io, Socket } from "socket.io-client";
import { expect } from 'chai';
import { basicJsonFlow, getBasicProcessFileData, getJsonFlowWithMissingInputTextProcessFileData } from '../utils/requestDatas';

describe('process_file event tests', function () {
    this.timeout(5000);

    let socket: Socket;

    beforeEach(function (done) {
        socket = io('http://localhost:5000');

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
        const processFileData = getBasicProcessFileData();

        socket.emit('process_file', processFileData);

        socket.once('run_end', (data) => {
            expect(data).to.have.property('output');
            done();
        });

        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

    it('process_file should trigger progress event', function (done) {
        const processFileData = getBasicProcessFileData();

        socket.emit('process_file', processFileData);

        socket.once('progress', (data) => {
            expect(data).to.have.property('output').to.equal(basicJsonFlow[0].inputText);
            expect(data).to.have.property('instanceName').to.equal(basicJsonFlow[0].name);
            done();
        });

        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

    it('process_file should trigger current_node_running event', function (done) {
        const processFileData = getBasicProcessFileData();

        socket.emit('process_file', processFileData);

        socket.once('current_node_running', (data) => {
            expect(data).to.have.property('instanceName').to.equal(basicJsonFlow[0].name);
            done();
        });

        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

    it('process_file with missing input should trigger error event', function (done) {
        const processFileData = getJsonFlowWithMissingInputTextProcessFileData();

        socket.emit('process_file', processFileData);
        socket.once('error', (error) => {
            done();
        });
    });
});