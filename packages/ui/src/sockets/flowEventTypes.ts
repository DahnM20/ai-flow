export interface FlowOnProgressEventData<T = any> {
  instanceName: string;
  output: T;
  isDone: boolean;
}

export interface FlowOnErrorEventData {
  instanceName: string;
  error: string;
}

export interface FlowOnCurrentNodeRunningEventData {
  instanceName: string;
}
