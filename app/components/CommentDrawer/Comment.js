import { cleanDate } from "~/utils/utils.mjs";

const Comment = ({ author, date, comment }) => (
  <div className="comment">
    <h3>{author}</h3>
    <h4>{cleanDate(date)}</h4>
    <p>{comment}</p>
  </div>
);

export default Comment;
