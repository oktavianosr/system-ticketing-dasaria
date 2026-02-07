import { useState, useEffect, useCallback } from 'react';
import SearchBar from '../components/tickets/SearchBar';
import FilterDropdown from '../components/tickets/FilterDropdown';
import Button from '../components/shared/Button';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import TicketTable from '../components/tickets/TicketTable';
import Pagination from '../components/shared/Pagination';
import { useUIContext } from '../context/UIContext';
import { ticketService } from '../api/services/ticketService';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface FilterOption {
    value: string;
    label: string;
}

interface Ticket {
    id: string | number;
    code: string;
    title: string;
    status: string;
    priority: string;
    assigned_to?: { name: string };
}

interface PaginatedResponse {
    data: Ticket[] | { data?: Ticket[] };
    meta?: { last_page: number; current_page: number };
}

const statusOptions: FilterOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'open', label: 'Open' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
];

const priorityOptions: FilterOption[] = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
];

const TicketListPage: React.FC = () => {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [searchKeyword, setSearchKeyword] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<string>('');
    const [priorityFilter, setPriorityFilter] = useState<string>('');
    const { showAlert } = useUIContext();
    const navigate = useNavigate();
    const { user } = useAuth();

    const canCreateTicket = user?.role !== 'agent';

    const fetchTickets = useCallback(async (params: { search?: string; status?: string; priority?: string; page?: number } = {}): Promise<void> => {
        setLoading(true);
        try {
            const response: PaginatedResponse = await ticketService.getAll({
                search: params.search ?? searchKeyword,
                status: params.status ?? statusFilter,
                priority: params.priority ?? priorityFilter,
                sort_by: 'created_at',
                sort_order: 'desc',
                page: params.page ?? currentPage,
                pagination: 10
            });

            const dataResult = (response.data as any)?.data || response.data || [];
            setTickets(Array.isArray(dataResult) ? dataResult : []);
            
            if ((response.data as any)?.last_page) {
                setTotalPages((response.data as any).last_page);
                setCurrentPage((response.data as any).current_page);
            } else if (response.meta?.last_page) {
                setTotalPages(response.meta.last_page);
                setCurrentPage(response.meta.current_page);
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tickets';
            showAlert(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    }, [searchKeyword, statusFilter, priorityFilter, currentPage, showAlert]);

    useEffect(() => {
        fetchTickets();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSearch = (keyword: string): void => {
        setSearchKeyword(keyword);
        setCurrentPage(1);
        fetchTickets({ search: keyword, page: 1 });
    };

    const handleStatusChange = (status: string): void => {
        setStatusFilter(status);
        setCurrentPage(1);
        fetchTickets({ status, page: 1 });
    };

    const handlePriorityChange = (priority: string): void => {
        setPriorityFilter(priority);
        setCurrentPage(1);
        fetchTickets({ priority, page: 1 });
    };

    const handlePageChange = (page: number): void => {
        setCurrentPage(page);
        fetchTickets({ page });
    };

    const handleCreateTicket = (): void => {
        navigate('/ticket/create');
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Tickets</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Manage and track your support tickets here
                        </p>
                    </div>
                    {canCreateTicket && (
                        <div className="mt-4 md:mt-0">
                            <Button variant="primary" size="md" onClick={handleCreateTicket}>
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    New Ticket
                                </span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar onSearch={handleSearch} />
                    </div>
                    <div className="w-full sm:w-40">
                        <FilterDropdown
                            label="Status"
                            value={statusFilter}
                            options={statusOptions}
                            onChange={handleStatusChange}
                        />
                    </div>
                    <div className="w-full sm:w-40">
                        <FilterDropdown
                            label="Priority"
                            value={priorityFilter}
                            options={priorityOptions}
                            onChange={handlePriorityChange}
                        />
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden relative min-h-[200px]">
                    {loading ? (
                        <div className="p-10 flex justify-center">
                            <LoadingSpinner />
                        </div>
                    ) : tickets.length > 0 ? (
                        <TicketTable tickets={tickets} />
                    ) : (
                        <div className="p-10 text-center text-gray-500">
                            Tidak ada tiket ditemukan.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketListPage;
