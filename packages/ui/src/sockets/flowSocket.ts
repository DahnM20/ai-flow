import { Socket } from "socket.io-client";

export type FlowEventIn =
  | "connect"
  | "progress"
  | "error"
  | "run_end"
  | "current_node_running"
  | "reconnect_error"
  | "disconnect";

export type FlowEventOut = "run_node" | "process_file" | "update_app_config";

export class FlowSocket {
  private socket: Socket;

  constructor(socket: Socket) {
    this.socket = socket;
  }

  public on(event: FlowEventIn, handler: (...args: any[]) => void): void {
    this.socket.on(event, handler);
  }

  public off(event: FlowEventIn, handler: (...args: any[]) => void): void {
    this.socket.off(event, handler);
  }

  public emit(event: FlowEventOut, ...args: any[]): void {
    this.socket.emit(event, ...args);
  }

  public connect(): void {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect(): void {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  public close(): void {
    this.socket.close();
  }
}
