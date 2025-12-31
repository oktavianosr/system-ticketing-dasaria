import React from 'react';
import FilterDropdown from './FilterDropdown';

const statusOptions = [
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
];

const TicketInfo = ({ ticket, agents = [], onStatusUpdate, onAssigneeUpdate, updatingStatus, assigningAgent }) => {
    const statusColors = {
        open: 'bg-green-100 text-green-800',
        in_progress: 'bg-yellow-100 text-yellow-800',
        resolved: 'bg-blue-100 text-blue-800',
        closed: 'bg-gray-100 text-gray-800',
    };

    const priorityColors = {
        high: 'bg-red-100 text-red-800',
        medium: 'bg-orange-100 text-orange-800',
        low: 'bg-blue-100 text-blue-800',
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const agentOptions = [
        { value: '', label: 'Select Agent...' },
        ...agents.map(agent => ({ value: agent.id.toString(), label: agent.name }))
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
                <div>
                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Description</h4>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {ticket.description}
                    </p>
                </div>
            </div>

            <div className="md:col-span-1 space-y-6 md:border-l md:border-gray-100 md:pl-6">
                {/* Status */}
                <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Status</h4>
                    {onStatusUpdate ? (
                        <FilterDropdown
                            value={ticket.status}
                            options={statusOptions}
                            onChange={onStatusUpdate}
                            disabled={updatingStatus}
                        />
                    ) : (
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${statusColors[ticket.status] || 'bg-gray-100 text-gray-800'}`}>
                            {ticket.status?.replace('_', ' ')}
                        </span>
                    )}
                </div>

                {/* Priority */}
                <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Priority</h4>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-800'}`}>
                        {ticket.priority}
                    </span>
                </div>

                {/* Requester */}
                <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Requester</h4>
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {getInitials(ticket.user?.name)}
                        </div>
                        <span className="text-sm text-gray-900">{ticket.user?.name || 'Unknown'}</span>
                    </div>
                </div>
                {/* Assignee Section */}
                <div>
                    <h4 className="text-xs font-medium text-gray-500 uppercase mb-2">Assigned To</h4>
                    {onAssigneeUpdate && agents.length > 0 ? (
                        <FilterDropdown
                            // Ambil ID-nya saja untuk value dropdown
                            value={ticket.assigned_id?.toString() || ticket.assigned_to?.id?.toString() || ''}
                            options={agentOptions}
                            onChange={onAssigneeUpdate}
                            disabled={assigningAgent}
                        />
                    ) : (
                        // Tampilan untuk Customer (yang tidak bisa update)
                        <div className="flex items-center gap-2">
                            {ticket.assigned_to ? (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-xs">
                                        {getInitials(ticket.assigned_to?.name)}
                                    </div>
                                    <span className="text-sm text-gray-900">{ticket.assigned_to?.name}</span>
                                </>
                            ) : (
                                <span className="text-sm text-gray-400">Unassigned</span>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TicketInfo;
