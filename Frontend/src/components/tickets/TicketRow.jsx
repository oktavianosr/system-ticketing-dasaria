const TicketRow = ({ ticket }) => {
    return (
        <tr>
            <td>{ticket.id}</td>
            <td>{ticket.subject}</td>
            <td>{ticket.status}</td>
            <td>{ticket.priority}</td>
            <td>
                <button>View</button>
            </td>
        </tr>
    );
};
export default TicketRow;
