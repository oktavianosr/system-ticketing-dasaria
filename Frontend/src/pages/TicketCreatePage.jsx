import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TicketForm from '../components/tickets/TicketForm';
import { ticketService } from '../api/services/ticketService';
import { useUIContext } from '../context/UIContext';

const TicketCreatePage = () => {
    const navigate = useNavigate();
    const { showAlert } = useUIContext();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (formData) => {
        setIsSubmitting(true);
        try {
            await ticketService.create(formData);
            showAlert('Ticket created successfully!', 'success');
            navigate('/tickets');
        } catch (error) {
            showAlert(error.message || 'Failed to create ticket', 'error');
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
