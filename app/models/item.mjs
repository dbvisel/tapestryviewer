import { v4 as uuidv4 } from "uuid";

export class Link {
  constructor({ from, to, comments, style }) {
    this.id = uuidv4();
    this.from = from || null;
    this.to = to || null;
    this.comments = comments || [];
    this.style = style || null;
  }
}

class Item {
  constructor({
    title,
    type,
    content,
    url,
    generalComments,
    clippingSetting,
    x,
    y,
    width,
    height,
    linksTo,
  }) {
    this.id = uuidv4();
    this.title = title || "New Item";
    this.type = type || "textFrame"; // enum(textFrame, image, video, audio, book, webpage, software, tapestry)
    this.url = url || "";
    this.content = content || "";
    this.generalComments = generalComments || [];
    this.specificComments = [];
    this.dateCreated = new Date();
    this.dateUpdated = new Date();
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1;
    this.height = height || 1;
    this.clippingSetting = clippingSetting;
    this.linksTo = linksTo || []; // array of IDs of other items in the same tapestry
  }
}

export default Item;
