import { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TicketHeader from '../components/tickets/TicketHeader';
import TicketInfo from '../components/tickets/TicketInfo';
import CommentList from '../components/tickets/CommentList';
import CommentForm from '../components/tickets/CommentForm';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import Button from '../components/shared/Button';
import { ticketService } from '../api/services/ticketService';
import { userService } from '../api/services/userService';
import { useUIContext } from '../context/UIContext';
import { useAuth } from '../hooks/useAuth';
import { useSocketNotifications } from '../hooks/useSocketNotification';

interface Agent {
    id: string | number;
    name: string;
}

interface User {
    id?: string | number;
    name: string;
    email: string;
    role?: string;
}

interface Comment {
    id: string | number;
    user?: User;
    creator?: User;
    author?: string;
    body?: string;
    text?: string;
    created_at?: string;
    date?: string;
}

interface Ticket {
    id: string | number;
    code: string;
    title: string;
    subject?: string;
    status: string;
    priority: string;
    description: string;
    created_at: string;
    user?: User;
    assigned_to?: Agent;
    assigned_id?: string | number;
    comments?: Comment[];
}

const TicketDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { showAlert } = useUIContext();
    const { user } = useAuth();

    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [agents, setAgents] = useState<Agent[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialLoading, setInitialLoading] = useState<boolean>(true);
    const [submittingComment, setSubmittingComment] = useState<boolean>(false);
    const [updatingStatus, setUpdatingStatus] = useState<boolean>(false);
    const [assigningAgent, setAssigningAgent] = useState<boolean>(false);

    const isAdminOrAgent = user?.role === 'admin' || user?.role === 'agent';

    const fetchTicket = useCallback(async (isInitial = false): Promise<void> => {
        if (isInitial) setInitialLoading(true);
        else setLoading(true);

        try {
            const response = await ticketService.getById(id);
            setTicket(response.data || response);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load ticket';
            showAlert(errorMessage, 'error');
        } finally {
            setInitialLoading(false);
            setLoading(false);
        }
    }, [id, showAlert]);

    const fetchAgents = useCallback(async (): Promise<void> => {
        if (!isAdminOrAgent) return;
        try {
            const response = await userService.getAgents();
            setAgents(response.data || response || []);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to load agents';
            showAlert(errorMessage, 'error');
        }
    }, [isAdminOrAgent, showAlert]);

    useEffect(() => {
        fetchTicket(true);
        fetchAgents();
    }, [fetchTicket, fetchAgents]);

    const handleStatusUpdate = async (newStatus: string): Promise<void> => {
        setUpdatingStatus(true);
        try {
            await ticketService.update(id, { status: newStatus });
            showAlert('Status updated successfully', 'success');
            fetchTicket();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
            showAlert(errorMessage, 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAssigneeUpdate = async (agentId: string): Promise<void> => {
        if (!agentId) return;
        setAssigningAgent(true);
        try {
            await ticketService.assignTicket(id, agentId);
            showAlert('Ticket assigned successfully', 'success');
            fetchTicket();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to assign ticket';
            showAlert(errorMessage, 'error');
        } finally {
            setAssigningAgent(false);
        }
    };

    const handleCommentSubmit = async (commentText: string): Promise<void> => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            await ticketService.addComment(id, commentText);
            showAlert('Comment added', 'success');
            fetchTicket();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to add comment';
            showAlert(errorMessage, 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    const socketCallbacks = useMemo(() => ({
        onCommentCreated: (data: any) => {
            if (data.ticket_id === parseInt(id!)) {
                setTicket(prev => {
                    if (!prev) return prev;
                    // Prevent duplicate comments if we already fetched/added it
                    const exists = prev.comments?.some(c => c.id === data.id);
                    if (exists) return prev;

                    return {
                        ...prev,
                        comments: [...(prev.comments || []), data]
                    };
                });

                // Only show alert if the comment is NOT from the current user
                if (data.user?.id !== user?.id) {
                    showAlert(`New comment from ${data.user?.name || 'someone'}`, 'info');
                }
            }
        },
        onStatusChanged: (data: any) => {
            if (data.ticket_id === parseInt(id!)) {
                setTicket(prev => prev ? { ...prev, status: data.status } : null);
                showAlert(`Ticket status changed to ${data.status}`, 'info');
            }
        }
    }), [id, showAlert, user?.id]);

    useSocketNotifications(id, socketCallbacks);

    if (initialLoading) {
        return (
            <div className="bg-gray-50 min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!ticket) {
        return (
            <div className="bg-gray-50 min-h-screen p-8">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-gray-500">Ticket not found.</p>
                    <Button variant="primary" onClick={() => navigate('/tickets')} className="mt-4">
                        Back to Tickets
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm" onClick={() => navigate('/tickets')}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back
                    </Button>
                    {loading && (
                        <div className="flex items-center gap-2 text-sm text-blue-600">
                            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                            Refreshing...
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <TicketHeader ticket={ticket} />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <TicketInfo
                        ticket={ticket}
                        agents={agents}
                        onStatusUpdate={isAdminOrAgent ? handleStatusUpdate : undefined}
                        onAssigneeUpdate={isAdminOrAgent ? handleAssigneeUpdate : undefined}
                        updatingStatus={updatingStatus}
                        assigningAgent={assigningAgent}
                    />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Discussion ({ticket.comments?.length || 0})
                    </h3>
                    <div className="space-y-6">
                        <CommentList comments={ticket.comments || []} />
                        <div className="pt-6 border-t border-gray-100">
                            <CommentForm onSubmit={handleCommentSubmit} isSubmitting={submittingComment} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetailPage;
