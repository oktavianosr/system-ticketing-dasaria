import React from 'react';

const Skeleton = ({ className = '', count = 1, height = '', width = '100%' }) => {
    return (
        <div className="space-y-2">
            {[...Array(count)].map((_, i) => (
                <div
                    key={i}
                    className={`animate-pulse bg-gray-200 rounded ${className}`}
                    style={{ height, width }}
                ></div>
            ))}
        </div>
    );
};

export default Skeleton;
