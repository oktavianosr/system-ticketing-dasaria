import { useState, useEffect, useCallback } from 'react';
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

const TicketDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { showAlert } = useUIContext();
    const { user } = useAuth();

    const [ticket, setTicket] = useState(null);
    const [agents, setAgents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submittingComment, setSubmittingComment] = useState(false);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [assigningAgent, setAssigningAgent] = useState(false);

    const isAdminOrAgent = user?.role === 'admin' || user?.role === 'agent';

    const fetchTicket = useCallback(async () => {
        setLoading(true);
        try {
            const response = await ticketService.getById(id);
            setTicket(response.data || response);
        } catch (error) {
            showAlert(error.message || 'Failed to load ticket', 'error');
        } finally {
            setLoading(false);
        }
    }, [id, showAlert]);

    const fetchAgents = useCallback(async () => {
        if (!isAdminOrAgent) return;
        try {
            const response = await userService.getAgents();
            setAgents(response.data || response || []);
        } catch (error) {
            console.error('Failed to fetch agents', error);
        }
    }, [isAdminOrAgent]);

    useEffect(() => {
        fetchTicket();
        fetchAgents();
    }, [fetchTicket, fetchAgents]);

    const handleStatusUpdate = async (newStatus) => {
        setUpdatingStatus(true);
        try {
            await ticketService.update(id, { status: newStatus });
            showAlert('Status updated successfully', 'success');
            fetchTicket();
        } catch (error) {
            showAlert(error.message || 'Failed to update status', 'error');
        } finally {
            setUpdatingStatus(false);
        }
    };

    const handleAssigneeUpdate = async (agentId) => {
        if (!agentId) return;
        setAssigningAgent(true);
        try {
            await ticketService.assignTicket(id, agentId);
            showAlert('Ticket assigned successfully', 'success');
            fetchTicket();
        } catch (error) {
            showAlert(error.message || 'Failed to assign ticket', 'error');
        } finally {
            setAssigningAgent(false);
        }
    };

    const handleCommentSubmit = async (commentText) => {
        if (!commentText.trim()) return;
        setSubmittingComment(true);
        try {
            await ticketService.addComment(id, { body: commentText });
            showAlert('Comment added', 'success');
            fetchTicket();
        } catch (error) {
            showAlert(error.message || 'Failed to add comment', 'error');
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
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
                <Button variant="outline" size="sm" onClick={() => navigate('/tickets')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back
                </Button>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <TicketHeader ticket={ticket} />
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <TicketInfo
                        ticket={ticket}
                        agents={agents}
                        onStatusUpdate={isAdminOrAgent ? handleStatusUpdate : null}
                        onAssigneeUpdate={isAdminOrAgent ? handleAssigneeUpdate : null}
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
