import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from "socket.io-client";

export type WSConfiguration = {
    openai_api_key?: string;
    stabilityai_api_key?: string;
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

const WS_HOST = process.env.REACT_APP_WS_HOST || 'localhost';
const WS_PORT = process.env.REACT_APP_WS_PORT || 5000;
const USE_HTTPS = process.env.REACT_APP_USE_HTTPS || 'false';

const protocol = USE_HTTPS.toLowerCase() === 'true' ? 'https' : 'http';

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

        const storedOpenAIKey = window.localStorage.getItem('openai_api_key');
        const storedStabilityAiKey = window.localStorage.getItem('stabilityai_api_key');

        setConfig({
            openai_api_key: !!storedOpenAIKey ? storedOpenAIKey : undefined,
            stabilityai_api_key: !!storedStabilityAiKey ? storedStabilityAiKey : undefined,
        })

        const newSocket = io(`${protocol}://${WS_HOST}:${WS_PORT}`);

        console.log(``)
        console.log(`Connecting to ${WS_HOST}:${WS_PORT} with ${protocol}`);

        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    function connectSocket(configuration: WSConfiguration): void {
        setConfig(configuration);

        const newSocket = io(`${protocol}://${WS_HOST}:${WS_PORT}`);

        console.log(`Connecting to ${WS_HOST}:${WS_PORT} with ${protocol}`);

        setSocket(newSocket);
    }

    function verifyConfiguration(): boolean {
        if (!config) {
            return false;
        }

        if (config.openai_api_key) {
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