const StatusUpdateForm = ({ currentStatus, onUpdate }) => {
    return (
        <div>
            <select defaultValue={currentStatus} onChange={(e) => onUpdate(e.target.value)}>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
            </select>
        </div>
    );
};
export default StatusUpdateForm;
