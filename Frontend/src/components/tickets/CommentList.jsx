import React from 'react';

const CommentList = ({ comments }) => {
    if (!comments || comments.length === 0) {
        return (
            <div className="text-center py-6 text-gray-500">
                No comments yet. Be the first to reply!
            </div>
        );
    }

    const getInitials = (name) => {
        if (!name) return '?';
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                    <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm">
                            {getInitials(comment.user.name || comment.author)}
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-gray-900">
                                    {comment.user.name || comment.author || 'Anonymous'}
                                </span>
                                <span className="text-xs text-gray-500">
                                    {formatDate(comment.created_at || comment.date)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                {comment.body || comment.text}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default CommentList;
