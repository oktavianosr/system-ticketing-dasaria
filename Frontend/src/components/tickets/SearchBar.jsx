import { useDebounce } from '../../hooks/useDebounce';
import { useEffect, useState } from 'react';

const SearchBar = ({ onSearch }) => {
    const [value, setValue] = useState('');
    const debouncedValue = useDebounce(value, 500);

    useEffect(() => {
        onSearch(debouncedValue);
    }, [debouncedValue, onSearch]);

    return (
        <input
            type="text"
            placeholder="Search tickets..."
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    );
};
export default SearchBar;
