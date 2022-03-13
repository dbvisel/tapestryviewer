import { useEffect, useState } from "react";
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
  const [addingComment, setAddingComment] = useState(false);
  const [message, setMessage] = useState("");
  let referent = tapestry;
  if (focused > -1) {
    referent = tapestry.items[focused];
  }

  const addComment = async (e) => {
    e.preventDefault();
    setAddingComment(false);
    setMessage("Submitting your comment...");
    const data = {
      referent: referent.hash,
      name: e.target["name"].value,
      date: new Date(),
      content: e.target["content"].value,
    };
    console.log(JSON.stringify(data));
    await fetch("/.netlify/functions/comment", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((response) => {
        console.log(response);
        setMessage("Comment submitted!");
      })
      .catch((e) => {
        console.error(e);
        setMessage("There was an error.");
      });
  };

  useEffect(() => {
    // TODO: get all the comments for that referent.
  }, [referent]);

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
        {addingComment ? (
          <form onSubmit={addComment}>
            <label>
              Name:
              <br />
              <input type="text" name="name" />
            </label>
            <label>
              Comment:
              <br />
              <textarea name="content" />
            </label>
            <input type="submit" value="Submit comment" />
          </form>
        ) : message ? (
          <p style={{ marginTop: "auto" }}>{message}</p>
        ) : (
          <button
            onClick={() => {
              setAddingComment(true);
            }}
          >
            Add new comment
          </button>
        )}
      </div>
    </nav>
  );
};

export default CommentDrawer;
