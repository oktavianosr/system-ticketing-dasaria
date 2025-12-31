const InputField = ({ label, type = 'text', value, onChange, error }) => {
    return (
        <div className="form-group">
            {label && <label>{label}</label>}
            <input
                type={type}
                className={`form-control ${error ? 'is-invalid' : ''}`}
                value={value}
                onChange={onChange}
            />
            {error && <div className="invalid-feedback">{error}</div>}
        </div>
    );
};
export default InputField;
