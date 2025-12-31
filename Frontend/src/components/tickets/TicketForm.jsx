import React from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Button from '../shared/Button';
import FormInput from '../ui/FormInput';
import FormSelect from '../ui/FormSelect';

const ticketSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    priority: z.enum(['low', 'medium', 'high']),
});

const TicketForm = ({ onSubmit, initialData = {}, isSubmitting = false }) => {
    const methods = useForm({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            title: initialData.title || '',
            description: initialData.description || '',
            priority: initialData.priority || 'medium',
        }
    });

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' }
    ];

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <FormInput
                        name="title"
                        label="Title"
                        placeholder="Brief summary of the issue"
                        fullWidth
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        {...methods.register('description')}
                        rows={4}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 ${methods.formState.errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Detailed description of the problem..."
                    />
                    {methods.formState.errors.description && (
                        <p className="mt-1 text-sm text-red-600">
                            {methods.formState.errors.description.message}
                        </p>
                    )}
                </div>

                <div>
                    <FormSelect
                        name="priority"
                        label="Priority"
                        options={priorityOptions}
                        fullWidth
                    />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button type="button" variant="secondary" onClick={() => window.history.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" variant="primary" isLoading={isSubmitting}>
                        {isSubmitting ? 'Saving...' : 'Submit Ticket'}
                    </Button>
                </div>
            </form>
        </FormProvider>
    );
};

export default TicketForm;
