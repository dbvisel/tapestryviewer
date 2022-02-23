import { v4 as uuidv4 } from "uuid";

class Comment {
  constructor({ author, content, responses }) {
    this.id = uuidv4();
    this.author = author || null;
    this.date = new Date();
    this.content = content || "";
    this.responses = responses || [];
  }
}

export default Comment;
