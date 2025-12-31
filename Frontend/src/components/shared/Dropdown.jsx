const Dropdown = ({ options, value, onChange, placeholder = 'Select...' }) => {
    return (
        <select value={value} onChange={onChange} className="form-select">
            <option value="">{placeholder}</option>
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
        </select>
    );
};
export default Dropdown;
