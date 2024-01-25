import { createContext, useState, ReactNode, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import { getWsUrl } from "../config/config";
import { APIKeys } from "../components/popups/config-popup/ApiKeys";
import { toastInfoMessage } from "../utils/toastUtils";
import { useTranslation } from "react-i18next";

export interface FlowEventData {
  jsonFile: string;
  nodeName?: string;
}

export type FlowEventName = "run_node" | "process_file";

export interface FlowEvent {
  name: FlowEventName;
  data: FlowEventData;
}

export type WSConfiguration = {
  apiKeys?: APIKeys;
};

interface ISocketContext {
  socket: Socket | null;
  config: WSConfiguration | null;
  updateConfig: (config: WSConfiguration) => void;
  emitEvent: (event: FlowEvent) => void;
}

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketContext = createContext<ISocketContext>({
  socket: null,
  config: null,
  updateConfig: (config: WSConfiguration) => {},
  emitEvent: (event: FlowEvent) => {},
});

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [config, setConfig] = useState<WSConfiguration | null>(null);

  const { t } = useTranslation("flow");

  useEffect(() => {
    if (socket) {
      socket.disconnect();
    }

    const storedApiKeys = window.localStorage.getItem("apiKeys");

    const config = {
      apiKeys: !!storedApiKeys ? JSON.parse(storedApiKeys) : undefined,
    };

    setConfig(config);

    if (!!socket) {
      return () => {
        socket.close();
      };
    }
  }, []);

  function updateConfig(config: WSConfiguration): void {
    if (!!socket) {
      socket.close();
      createNewSocket(config);
    } else {
      setConfig(config);
    }
  }

  function getActiveSocket(): Socket | null {
    if (!socket && !!config) {
      return createNewSocket(config);
    }
    return socket;
  }

  function createNewSocket(configuration: WSConfiguration) {
    setConfig(configuration);

    const newSocket = io(getWsUrl());

    setSocket(newSocket);
    return newSocket;
  }

  function emitEvent(event: FlowEvent) {
    if (!verifyConfiguration()) {
      toastInfoMessage(t("ApiKeyRequiredMessage"));
      return;
    }

    const activeSocket = getActiveSocket();

    if (activeSocket) {
      activeSocket.emit(event.name, {
        ...event.data,
        apiKeys: config?.apiKeys,
      });
    }
  }

  function verifyConfiguration(): boolean {
    if (!config) {
      return false;
    }

    if (config.apiKeys?.openai_api_key) {
      return true;
    }

    return false;
  }

  return (
    <SocketContext.Provider
      value={{
        socket,
        config,
        updateConfig,
        emitEvent,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
