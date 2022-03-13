import Comment from "./Comment";

const comments = [
  {
    id: 1,
    author: "Dan",
    date: "Sun Mar 13 2022 19:40:12 GMT+0800 (Singapore Standard Time)",
    content: "This is the first comment.",
  },
  {
    id: 2,
    author: "Dan",
    date: "Sun Mar 13 2022 21:40:12 GMT+0800 (Singapore Standard Time)",
    content: "This is the second comment. Comments are plain-text.",
  },
  {
    id: 3,
    author: "Dan",
    date: "Sun Mar 13 2022 21:40:12 GMT+0800 (Singapore Standard Time)",
    content:
      "This is the third comment. Comments are linear not threaded for now.",
  },
];

const CommentDrawer = ({
  commentShown,
  setCommentShown,
  focused,
  tapestry,
}) => {
  let referent = tapestry;
  if (focused > -1) {
    referent = tapestry.items[focused];
  }
  console.log(referent.title, referent.hash);
  return (
    <nav
      className="commentdrawer"
      style={{ transform: `translateX(${commentShown ? 0 : 100}%)` }}
    >
      <h2
        onClick={() => {
          setCommentShown(!commentShown);
        }}
      >
        Comments
      </h2>
      <h3>Comments for {referent.title}</h3>
      <div>
        {comments.length ? (
          comments.map((comment, index) => (
            <Comment
              author={comment.author}
              date={comment.date}
              comment={comment.content}
              key={index}
            />
          ))
        ) : (
          <p>No comments yet.</p>
        )}
        <button>Add new comment</button>
      </div>
    </nav>
  );
};

export default CommentDrawer;
