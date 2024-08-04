import { expect } from "chai";
import {
  disconnectSocket,
  getSocket,
  setupSocket,
} from "../../utils/testHooks";
import {
  createRequestData,
  flowWithFourParallelNodeStep,
  flowWithoutLinks,
  sequentialFlow,
} from "../../utils/requestDatas";

describe("Node errors test", function () {
  this.timeout(30000);

  beforeEach(function (done) {
    setupSocket(done);
  });

  afterEach(function () {
    disconnectSocket();
  });

  it("Error in sequential flow should stop the flow", function (done) {
    const socket = getSocket();

    const flowNodesWithOneError = structuredClone(sequentialFlow);
    flowNodesWithOneError[1] = {
      ...flowNodesWithOneError[1],
      raiseError: true,
    };

    socket.emit("process_file", createRequestData(flowNodesWithOneError));

    let errorReceived = false;
    let progressCount = 0;
    const progressBeforeError = 1;

    socket.on("error", (error) => {
      errorReceived = true;
      expect(progressCount).to.equal(progressBeforeError);
    });

    socket.on("progress", (progress) => {
      if (errorReceived) {
        done(new Error("Received progress after error"));
      }
      progressCount++;
      if (progressCount > progressBeforeError) {
        done(new Error(`Too many nodes sent progress`));
      }
    });

    setTimeout(() => {
      if (!errorReceived) {
        socket.disconnect();
        done(new Error("No error received within the expected time"));
      } else {
        done();
      }
    }, 10000);
  });

  it("Error in flow without link should run the others nodes", function (done) {
    const socket = getSocket();

    const flow = structuredClone(sequentialFlow);
    flow[1] = {
      ...flow[1],
      raiseError: true,
    };

    socket.emit("process_file", createRequestData(flow));

    let errorReceived = false;
    let progressCount = 0;
    const maxProgressBeforeError = 2;

    socket.on("error", (error) => {
      errorReceived = true;
      expect(progressCount).to.be.at.most(maxProgressBeforeError);
    });

    socket.on("progress", (progress) => {
      progressCount++;
      if (progressCount > maxProgressBeforeError) {
        done(new Error(`Too many nodes sent progress`));
      }
    });

    setTimeout(() => {
      if (errorReceived && progressCount === 1) {
        socket.disconnect();
        done();
      } else {
        done(new Error("No error received within the expected time"));
      }
    }, 2000);
  });

  it("Error in flow with 4 parallel node should return result for all of them except the one in error", function (done) {
    const socket = getSocket();

    const flow = structuredClone(flowWithFourParallelNodeStep);

    flow[4] = {
      ...flow[4],
      raiseError: true,
    };

    flow[1] = {
      ...flow[1],
      sleepDuration: 2,
    }; //One node with high delay to be sure he is processed during the error raise

    socket.emit("process_file", createRequestData(flow));

    let errorReceived = false;
    let progressCount = 0;
    const maxProgressBeforeError = 4;

    socket.on("error", (error) => {
      errorReceived = true;
      expect(progressCount).to.be.at.most(maxProgressBeforeError);
    });

    socket.on("progress", (progress) => {
      progressCount++;
      if (progressCount > maxProgressBeforeError) {
        done(new Error(`Too many nodes sent progress`));
      }
    });

    socket.on("run_end", (end) => {
      if (progressCount !== maxProgressBeforeError) {
        done(
          new Error(`Not all nodes were processed before end of execution.`)
        );
      } else {
        done();
      }
    });
  });
});
