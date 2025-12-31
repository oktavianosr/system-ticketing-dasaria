import { useNavigate } from 'react-router-dom';

const TicketRow = ({ ticket, index }) => {
    const navigate = useNavigate();

    const statusColors = {
        open: 'bg-green-100 text-green-700',
        in_progress: 'bg-yellow-100 text-yellow-700',
        resolved: 'bg-blue-100 text-blue-700',
        closed: 'bg-gray-100 text-gray-700'
    };

    const priorityColors = {
        high: 'bg-red-100 text-red-700',
        medium: 'bg-orange-100 text-orange-700',
        low: 'bg-blue-100 text-blue-700'
    };

    return (
        <tr className="hover:bg-gray-50 border-b border-gray-100 transition-colors cursor-pointer" onClick={() => navigate(`/tickets/${ticket.id}`)}>
            <td className="px-6 py-4 text-sm text-gray-500 font-medium">{index}</td>
            <td className="px-6 py-4 text-sm text-gray-500 font-medium">#{ticket.code}</td>
            <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{ticket.title}</td>
            <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${statusColors[ticket.status] || 'bg-gray-100 text-gray-700'}`}>
                    {ticket.status?.replace('_', ' ')}
                </span>
            </td>
            <td className="px-6 py-4 text-sm">
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${priorityColors[ticket.priority] || 'bg-gray-100 text-gray-700'}`}>
                    {ticket.priority}
                </span>
            </td>
            <td className="px-6 py-4 text-sm text-right">
                <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/tickets/${ticket.id}`); }}
                    className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                    View Details
                </button>
            </td>
        </tr>
    );
};

export default TicketRow;
