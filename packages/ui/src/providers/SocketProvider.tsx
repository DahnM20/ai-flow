import { createContext, useState, ReactNode, useEffect } from "react";
import { io } from "socket.io-client";
import { getWsUrl } from "../config/config";
import {
  Parameters,
  getConfigParametersFlat,
} from "../components/popups/config-popup/parameters";
import { toastInfoMessage } from "../utils/toastUtils";
import { useTranslation } from "react-i18next";
import { FlowEventOut, FlowSocket } from "../sockets/flowSocket";

export interface FlowEventData {
  jsonFile: string;
  nodeName?: string;
}

export interface FlowEvent {
  name: FlowEventOut;
  data: FlowEventData;
}

export type WSConfiguration = {
  parameters?: Parameters;
};

interface ISocketContext {
  socket: FlowSocket | null;
  config: WSConfiguration | null;
  updateSocket: (config?: WSConfiguration) => void;
  emitEvent: (event: FlowEvent) => boolean;
}

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  config: null,
  updateSocket: (config?: WSConfiguration) => {},
  emitEvent: (event: FlowEvent) => false,
});

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<FlowSocket | null>(null);
  const [config, setConfig] = useState<WSConfiguration | null>(null);

  const { t } = useTranslation("flow");

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }

    const config = {};

    setConfig(config);

    if (!!socket) {
      return () => {
        socket.close();
      };
    }
  }, []);

  function updateSocket(config?: WSConfiguration): void {
    if (!!socket) {
      socket.close();
      createNewSocket(config);
    } else {
      if (config) setConfig(config);
    }
  }

  function getActiveSocket(): FlowSocket | null {
    if (!socket && !!config) {
      return createNewSocket(config);
    }
    return socket;
  }

  function createNewSocket(configuration?: WSConfiguration) {
    if (configuration) setConfig(configuration);

    const newSocket = new FlowSocket(io(getWsUrl()));

    setSocket(newSocket);
    return newSocket;
  }

  function emitEvent(event: FlowEvent): boolean {
    if (!verifyConfiguration()) {
      toastInfoMessage(t("ApiKeyRequiredMessage"));
      return false;
    }

    const activeSocket = getActiveSocket();

    if (activeSocket) {
      activeSocket.emit(event.name, {
        ...event.data,
        parameters: getConfigParametersFlat(),
      });

      return true;
    }

    return false;
  }

  function verifyConfiguration(): boolean {
    const params = getConfigParametersFlat();
    if (!params) {
      return false;
    }

    if (
      params.openai_api_key ||
      params.stabilityai_api_key ||
      params.replicate_api_key
    ) {
      return true;
    }

    return false;
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        config,
        updateSocket,
        emitEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
