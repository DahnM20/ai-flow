import { expect } from "chai";
import { disconnectSocket, getSocket, setupSocket } from "../../utils/testHooks";
import { createRequestData } from "../../utils/requestDatas";

describe('node with multiple parent test', function () {
    this.timeout(15000);

    beforeEach(function (done) {
        setupSocket(done);
    });

    afterEach(function () {
        disconnectSocket();
    });

    const flowWithNodesWithMultipleParents = [
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
            inputs: [
                {
                    "inputNode": "1#llm-prompt",
                    "inputNodeOutputKey": 0
                },
                {
                    "inputNode": "2#llm-prompt",
                    "inputNodeOutputKey": 0
                }
            ],
            name: "3#stable-diffusion-stabilityai-prompt",
            processorType: "stable-diffusion-stabilityai-prompt",
        }
    ];

    it('process_file should process both parents before the child', function (done) {
        const socket = getSocket();
        socket.emit('process_file', createRequestData(flowWithNodesWithMultipleParents));

        let processedNodes: string[] = [];

        socket.on('progress', (data) => {
            processedNodes.push(data.instanceName);

            if (processedNodes.length === flowWithNodesWithMultipleParents.length) {
                try {
                    // Check if both parents are processed before the child
                    expect(processedNodes.includes("1#llm-prompt")).to.be.true;
                    expect(processedNodes.includes("2#llm-prompt")).to.be.true;
                    expect(processedNodes.indexOf("3#stable-diffusion-stabilityai-prompt")).to.be.greaterThan(processedNodes.indexOf("1#llm-prompt"));
                    expect(processedNodes.indexOf("3#stable-diffusion-stabilityai-prompt")).to.be.greaterThan(processedNodes.indexOf("2#llm-prompt"));
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