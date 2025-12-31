import React from 'react';

const FilterDropdown = ({ label, value, options, onChange }) => {
    return (
        <div className="flex flex-col">
            {label && (
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                    {label}
                </label>
            )}
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default FilterDropdown;
