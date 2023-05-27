import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { io, Socket } from "socket.io-client";

interface ISocketContext {
    socket: Socket | null;
}

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketContext = createContext<ISocketContext>({ socket: null });

export const SocketProvider = ({ children }: SocketProviderProps) => {
    const [socket, setSocket] = useState<Socket | null>(null);

    useEffect(() => {
        const newSocket = io('http://localhost:5000');
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};