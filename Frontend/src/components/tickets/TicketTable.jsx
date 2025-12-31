import TicketRow from './TicketRow';

const TicketTable = ({ tickets }) => {
    return (
        <table className="table table-auto w-full border-collapse border border-gray-500 rounded-lg overflow-hidden">
            <thead>
                <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID-Ticket</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
            </thead>
            <tbody>
                {tickets.map((ticket, index) => (
                    <TicketRow key={ticket.id} ticket={ticket} index={index + 1} />
                ))}
            </tbody>
        </table>
    );
};
export default TicketTable;
