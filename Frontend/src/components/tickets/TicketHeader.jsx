const TicketHeader = ({ ticket }) => {
    return (
        <div className="ticket-header">
            <h2>{ticket.subject} <small>#{ticket.id}</small></h2>
        </div>
    );
};
export default TicketHeader;
