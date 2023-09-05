import { io, Socket } from "socket.io-client";
import { expect } from 'chai';
import { basicJsonFlow, getBasicRunNodeData, getJsonFlowWithMissingInputTextProcessFileData } from '../utils/requestDatas';

describe('run_node event tests', function () {
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

    it('run_node should trigger progress event', function (done) {
        const runNodeData = getBasicRunNodeData();

        socket.emit('run_node', runNodeData);

        socket.once('progress', (data) => {
            expect(data).to.have.property('output').to.equal(basicJsonFlow[0].inputText);
            expect(data).to.have.property('instance_name').to.equal(basicJsonFlow[0].name);
            done();
        });

        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

    it('run_node should trigger current_node_running event', function (done) {
        const runNodeData = getBasicRunNodeData();

        socket.emit('run_node', runNodeData);

        socket.once('current_node_running', (data) => {
            expect(data).to.have.property('instance_name').to.equal(basicJsonFlow[0].name);
            done();
        });

        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

    it('run_node with missing input should trigger error event', function (done) {
        const processFileData = getJsonFlowWithMissingInputTextProcessFileData();

        socket.emit('run_node', processFileData);
        socket.once('error', (error) => {
            done();
        });
    });
});