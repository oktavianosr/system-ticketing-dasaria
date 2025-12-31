import React from 'react';

const InputField = ({
    label,
    type = 'text',
    value,
    onChange,
    error,
    placeholder,
    fullWidth = false,
    className = '',
    ...props
}) => {
    return (
        <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <input
                type={type}
                className={`
                    block w-full px-3 py-2 border rounded-md shadow-sm 
                    placeholder-gray-400 focus:outline-none focus:ring-1 
                    disabled:bg-gray-50 disabled:text-gray-500
                    ${error
                        ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                    }
                `}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                {...props}
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default InputField;
