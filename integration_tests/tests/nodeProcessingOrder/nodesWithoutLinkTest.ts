import { expect } from "chai";
import { disconnectSocket, getSocket, setupSocket } from "../../utils/testHooks";
import { createRequestData } from "../../utils/requestDatas";

describe('node without link test', function () {
    this.timeout(15000);

    beforeEach(function (done) {
        setupSocket(done);
    });

    afterEach(function () {
        disconnectSocket();
    });

    const flowWithNodesWithoutLink = [
        {
            inputs: [],
            name: "1#llm-prompt",
            processorType: "llm-prompt",
        },
        {
            inputs: [],
            name: "2#llm-prompt",
            processorType: "llm-prompt",
        },
        {
            inputs: [],
            name: "3#stable-diffusion-stabilityai-prompt",
            processorType: "stable-diffusion-stabilityai-prompt",
        }
    ];

    it('process_file should process all the nodes', function (done) {
        const socket = getSocket();
        socket.emit('process_file', createRequestData(flowWithNodesWithoutLink));

        let processedNodes: string[] = [];

        socket.on('progress', (data) => {
            processedNodes.push(data.instanceName);

            if (processedNodes.length === flowWithNodesWithoutLink.length) {
                try {
                    expect(processedNodes).to.includes(flowWithNodesWithoutLink[0].name);
                    expect(processedNodes).to.includes(flowWithNodesWithoutLink[1].name);
                    expect(processedNodes).to.includes(flowWithNodesWithoutLink[2].name);
                    done();
                } catch (error) {
                    done(error);
                }
            }
        });

        socket.on('error', (error) => {
            done(new Error(`Error event received: ${JSON.stringify(error)}`));
        });
    });

});

