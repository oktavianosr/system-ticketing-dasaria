const TicketInfo = ({ ticket }) => {
    return (
        <div className="ticket-info">
            <p><strong>Status:</strong> {ticket.status}</p>
            <p><strong>Priority:</strong> {ticket.priority}</p>
            <p><strong>Description:</strong> {ticket.description}</p>
        </div>
    );
};
export default TicketInfo;
