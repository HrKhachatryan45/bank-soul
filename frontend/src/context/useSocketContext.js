import { createContext, useContext, useEffect, useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const useSocketContext = () => {
    return useContext(SocketContext);
}

export const SocketContextProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);
    const { authUser, setAuthUser } = useAuthContext();

    useEffect(() => {
        if (authUser) {
            const socketInstance = io('http://localhost:8080/', {
                query: { userId: authUser._id }
            });
            setSocket(socketInstance);

            // Cleanup: Close the socket connection on unmount or when `authUser` changes
            return () => {
                socketInstance.close();
                setSocket(null); // Optionally reset socket to null
            }
        } else {
            // Close socket if `authUser` is not available
            if (socket) {
                socket.close();
                setSocket(null);
            }
        }
    }, [authUser]);

    useEffect(() => {
        if (socket) {
            socket.on('updateUser', (data) => {
                setAuthUser(data);
            });

            // Cleanup: Remove socket event listeners on unmount
            return () => {
                socket.off('updateUser'); // Unsubscribe to avoid memory leaks
            }
        }
    }, [socket]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
}
