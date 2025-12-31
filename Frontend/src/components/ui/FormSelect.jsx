import React from 'react';
import { useFormContext } from 'react-hook-form';

const FormSelect = ({ name, label, options, validation, fullWidth = false, ...props }) => {
    const {
        register,
        formState: { errors }
    } = useFormContext();

    const error = errors[name];
    const widthClass = fullWidth ? "w-full" : "";
    const borderColor = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-300 focus:border-blue-500 focus:ring-blue-500";

    return (
        <div className={`${widthClass} mb-4`}>
            {label && (
                <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                </label>
            )}
            <div className="relative">
                <select
                    id={name}
                    {...register(name, validation)}
                    className={`block ${widthClass} px-3 py-2 bg-white border rounded-md shadow-sm focus:outline-none focus:ring-1 sm:text-sm ${borderColor}`}
                    {...props}
                >
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p className="mt-1 text-sm text-red-600">
                        {error.message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default FormSelect;
