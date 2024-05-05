export interface FlowOnProgressEventData<T = any> {
  instanceName: string;
  output: T;
  isDone: boolean;
}

export interface FlowOnErrorEventData {
  instanceName: string;
  nodeName: string;
  error: string;
}

export interface FlowOnCurrentNodeRunningEventData {
  instanceName: string;
}
