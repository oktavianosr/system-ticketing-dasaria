import React from 'react';

const LoadingSpinner = ({ fullScreen = false }) => {
    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex justify-center p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-100 border-t-blue-600"></div>
        </div>
    );
};

export default LoadingSpinner;
