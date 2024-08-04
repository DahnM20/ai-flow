import { expect } from "chai";
import {
  disconnectSocket,
  getSocket,
  setupSocket,
} from "../../utils/testHooks";
import {
  createRequestData,
  flowWithFourParallelNodeStep,
} from "../../utils/requestDatas";

describe("Node errors test", function () {
  this.timeout(15000);

  beforeEach(function (done) {
    setupSocket(done);
  });

  afterEach(function () {
    disconnectSocket();
  });

  it("4 parallel node with 2s sleep each should not compound time", function (done) {
    const socket = getSocket();

    const flow = structuredClone(flowWithFourParallelNodeStep);

    flow[1] = {
      ...flow[1],
      sleepDuration: 2,
    };

    flow[2] = {
      ...flow[2],
      sleepDuration: 2,
    };

    flow[3] = {
      ...flow[3],
      sleepDuration: 2,
    };

    flow[4] = {
      ...flow[4],
      sleepDuration: 2,
    };

    const maxDurationMsExpected = 5000;
    const timeStart = Date.now();
    socket.emit("process_file", createRequestData(flow));

    let progressCount = 0;
    const maxProgress = 5;

    socket.on("progress", (progress) => {
      progressCount++;
      if (progressCount > maxProgress) {
        done(new Error(`Too many nodes sent progress`));
      }
    });

    socket.on("run_end", (end) => {
      if (progressCount !== maxProgress) {
        done(
          new Error(`Not all nodes were processed before end of execution.`)
        );
      } else {
        const timeEnd = Date.now();
        const duration = timeEnd - timeStart;
        expect(duration).to.be.lessThan(maxDurationMsExpected);
        done();
      }
    });
  });
});
