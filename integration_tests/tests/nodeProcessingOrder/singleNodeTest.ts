import { expect } from "chai";
import { Socket, io } from "socket.io-client";
import { createRequestData } from "../../utils/requestDatas";

describe('single node test', function () {
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

    const flowWithSingleNode = [
        {
            inputs: [],
            name: "1#llm-prompt",
            processorType: "llm-prompt",
        }
    ];

    it('process_file should trigger one progress event', function (done) {
        socket.emit('process_file', createRequestData(flowWithSingleNode));

        socket.once('progress', (data) => {
            expect(data).to.have.property('instanceName').to.equal(flowWithSingleNode[0].name);
            done();
        });

        socket.once('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

});