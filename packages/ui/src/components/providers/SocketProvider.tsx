import React, { createContext, useState, ReactNode, useEffect, useContext } from 'react';
import { io, Socket } from "socket.io-client";
import { APIKeys } from '../popups/configPopup/ApiKeys';
import { getWsUrl } from '../../utils/config';

export type WSConfiguration = {
    apiKeys?: APIKeys;
}

interface ISocketContext {
    socket: Socket | null;
    config: WSConfiguration | null;
    verifyConfiguration: (() => boolean);
    connectSocket: ((configuration: WSConfiguration) => void) | null;
}

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketContext = createContext<ISocketContext>({
    socket: null,
    config: null,
    verifyConfiguration: () => { return false },
    connectSocket: null
});

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [config, setConfig] = useState<WSConfiguration | null>(null);

    useEffect(() => {
        if (socket) {
            socket.disconnect();
        }

        const storedApiKeys = window.localStorage.getItem('apiKeys');

        const config = {
            apiKeys: !!storedApiKeys ? JSON.parse(storedApiKeys) : undefined,
        }

        // Connect by default only if user got api keys
        if (!!storedApiKeys) {
            const newSocket = connectSocket(config);

            setSocket(newSocket);

            return () => {
                newSocket.close();
            };
        }

    }, []);

    function connectSocket(configuration: WSConfiguration): Socket {
        setConfig(configuration);

        const newSocket = io(getWsUrl());

        setSocket(newSocket);

        return newSocket;
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
        <SocketContext.Provider value={{ socket, config, verifyConfiguration, connectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};