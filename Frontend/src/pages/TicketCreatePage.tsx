import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/tickets/TicketForm';
import { ticketService } from '../api/services/ticketService';
import { useUIContext } from '../context/UIContext';

interface TicketFormData {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
}

const TicketCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const { showAlert } = useUIContext();
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleSubmit = async (formData: TicketFormData): Promise<void> => {
        setIsSubmitting(true);
        try {
            await ticketService.create(formData);
            showAlert('Ticket created successfully!', 'success');
            navigate('/tickets');
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Failed to create ticket';
            showAlert(errorMessage, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold text-gray-900">Create New Ticket</h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Please provide the details of your issue below.
                        </p>
                    </div>

                    <TicketForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                </div>
            </div>
        </div>
    );
};

export default TicketCreatePage;
