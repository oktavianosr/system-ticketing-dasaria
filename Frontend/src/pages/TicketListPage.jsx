import TicketTable from '../components/tickets/TicketTable';
import SearchBar from '../components/tickets/SearchBar';
import Button from '../components/shared/Button';

const TicketListPage = () => {
    const tickets = [
        { id: 1, subject: 'Login issue', status: 'open', priority: 'high' },
        { id: 2, subject: 'Bug in dashboard', status: 'closed', priority: 'medium' },
    ];

    return (
        <div className="ticket-list-page">
            <div className="page-header">
                <h1>Tickets</h1>
                <Button>New Ticket</Button>
            </div>
            <SearchBar onSearch={(val) => console.log(val)} />
            <TicketTable tickets={tickets} />
        </div>
    );
};
export default TicketListPage;
