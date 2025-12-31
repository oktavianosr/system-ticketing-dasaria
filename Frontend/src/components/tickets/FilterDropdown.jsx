const FilterDropdown = ({ onChange }) => {
    return (
        <select onChange={(e) => onChange(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
        </select>
    );
};
export default FilterDropdown;
