import React, { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import InputField from '../shared/InputField';

const SearchBar = ({ onSearch }) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="w-full">
            <InputField
                fullWidth
                placeholder="Search tickets by subject or ID..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full"
            />
        </div>
    );
};

export default SearchBar;
