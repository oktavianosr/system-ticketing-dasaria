import TicketRow from './TicketRow';

const TicketTable = ({ tickets }) => {
    return (
        <table className="table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Subject</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map(ticket => (
                    <TicketRow key={ticket.id} ticket={ticket} />
                ))}
            </tbody>
        </table>
    );
};
export default TicketTable;
