import React, { useState } from 'react';
import Button from '../shared/Button';

const CommentForm = ({ onSubmit, isSubmitting = false }) => {
    const [text, setText] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        onSubmit(text);
        setText('');
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="border border-gray-300 rounded-lg shadow-sm overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
                <textarea
                    rows={3}
                    className="block w-full py-3 px-4 resize-none border-0 focus:ring-0 sm:text-sm placeholder-gray-400"
                    placeholder="Add a reply..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={isSubmitting}
                />
            </div>
            <div className="mt-2 flex justify-end">
                <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    disabled={!text.trim() || isSubmitting}
                    isLoading={isSubmitting}
                >
                    Post Reply
                </Button>
            </div>
        </form>
    );
};

export default CommentForm;
