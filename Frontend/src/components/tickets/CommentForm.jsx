const CommentForm = ({ onSubmit }) => {
    return (
        <form onSubmit={onSubmit}>
            <textarea placeholder="Add a comment..." />
            <button type="submit">Submit</button>
        </form>
    );
};
export default CommentForm;
