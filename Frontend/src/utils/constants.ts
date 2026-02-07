export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const TICKET_STATUS = {
    OPEN: 'open',
    IN_PROGRESS: 'in_progress',
    CLOSED: 'closed',
} as const;
