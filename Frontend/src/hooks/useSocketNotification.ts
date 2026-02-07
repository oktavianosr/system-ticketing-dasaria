import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface SocketCallbacks {
    onCommentCreated?: (data: unknown) => void;
    onStatusChanged?: (data: unknown) => void;
}

export const useSocketNotifications = (ticketId: string | number | undefined, callbacks: SocketCallbacks = {}): Socket | null => {
    const socketRef = useRef<Socket | null>(null);
    const callbacksRef = useRef(callbacks);

    // Update callbacks ref whenever they change so listeners always have the latest ones
    useEffect(() => {
        callbacksRef.current = callbacks;
    }, [callbacks]);

    useEffect(() => {
        if (!ticketId) return;

        console.log('Initializing socket connection for ticket:', ticketId);

        socketRef.current = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 10,
            timeout: 20000,
            autoConnect: true,
        });

        const socket = socketRef.current;

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            socket.emit('join-ticket', ticketId);
        });

        socket.on('connect_error', (error: Error) => {
            console.error('Socket connection error:', error);
        });

        socket.on('disconnect', (reason: string) => {
            console.log('Socket disconnected:', reason);
        });

        socket.on('comment_created', (data: unknown) => {
            console.log('Received comment_created event:', data);
            callbacksRef.current.onCommentCreated?.(data);
        });

        socket.on('status_changed', (data: unknown) => {
            console.log('Received status_changed event:', data);
            callbacksRef.current.onStatusChanged?.(data);
        });

        return () => {
            console.log('Cleaning up socket connection');
            socket.emit('leave-ticket', ticketId);
            socket.disconnect();
        };
    }, [ticketId]); // Only reconnect if ticketId changes

    return socketRef.current;
};
