import React from 'react';

const TicketHeader = ({ ticket }) => {
    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                    <span className="font-mono">#{ticket.code || ticket.id}</span>
                    <span>•</span>
                    <span>Created {formatDate(ticket.created_at)}</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900">{ticket.title || ticket.subject}</h1>
            </div>
        </div>
    );
};

export default TicketHeader;
