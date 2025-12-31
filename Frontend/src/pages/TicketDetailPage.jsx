import { useParams } from 'react-router-dom';
import TicketHeader from '../components/tickets/TicketHeader';
import TicketInfo from '../components/tickets/TicketInfo';
import CommentList from '../components/tickets/CommentList';
import CommentForm from '../components/tickets/CommentForm';

const TicketDetailPage = () => {
    const { id } = useParams();
    const ticket = { id, subject: 'Login issue', status: 'open', priority: 'high', description: 'Cannot login' };
    const comments = [{ id: 1, text: 'Looking into it' }];

    return (
        <div className="ticket-detail-page">
            <TicketHeader ticket={ticket} />
            <TicketInfo ticket={ticket} />
            <hr />
            <h3>Comments</h3>
            <CommentList comments={comments} />
            <CommentForm onSubmit={() => { }} />
        </div>
    );
};
export default TicketDetailPage;
