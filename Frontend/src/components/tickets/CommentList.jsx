const CommentList = ({ comments }) => {
    return (
        <div className="comments-list">
            {comments.map(c => (
                <div key={c.id} className="comment">
                    <p>{c.text}</p>
                </div>
            ))}
        </div>
    );
};
export default CommentList;
