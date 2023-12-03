import { expect } from "chai";
import { disconnectSocket, getSocket, setupSocket } from "../../utils/testHooks";
import { createRequestData } from "../../utils/requestDatas";

describe('node with children test', function () {
    this.timeout(15000);

    beforeEach(function (done) {
        setupSocket(done);
    });

    afterEach(function () {
        disconnectSocket();
    });

    const flowNodeWithChildren = [
        {
            inputs: [],
            name: "1#llm-prompt",
            processorType: "llm-prompt",
        },
        {
            inputs: [
                {
                    "inputNode": "1#llm-prompt",
                    "inputNodeOutputKey": 0
                }
            ],
            name: "2#llm-prompt",
            processorType: "llm-prompt",
        },
        {
            inputs: [
                {
                    "inputNode": "1#llm-prompt",
                    "inputNodeOutputKey": 0
                }
            ],
            name: "3#stable-diffusion-stabilityai-prompt",
            processorType: "stable-diffusion-stabilityai-prompt",
        }
    ];

    it('process_file should process the parent first, then its children', function (done) {
        const socket = getSocket();
        socket.emit('process_file', createRequestData(flowNodeWithChildren));

        let processedNodes: string[] = [];

        socket.on('progress', (data) => {
            processedNodes.push(data.instanceName);

            if (processedNodes.length === flowNodeWithChildren.length) {
                try {
                    //First one needs to be the parent 
                    expect(processedNodes[0]).to.equal(flowNodeWithChildren[0].name);

                    expect(processedNodes).to.includes(flowNodeWithChildren[1].name);
                    expect(processedNodes).to.includes(flowNodeWithChildren[2].name);
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