import { v4 as uuidv4 } from "uuid";

// this isn't currently being used – instead right now we're just using the ID of the item being linked to in the linking item.
export class Link {
  constructor({ from, to, comments, style }) {
    this.id = uuidv4();
    this.from = from || null;
    this.to = to || null;
    this.comments = comments || [];
    this.style = style || null;
  }
}

// This defines the item class.
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
    googleId,
    googleLinksTo,
    hideTitle,
    thumbnail,
  }) {
    const uuid = uuidv4();
    this.id = uuid;
    this.title = title || "New Item"; // the title of the item, can be hidden with hide title
    this.type = type || "textFrame"; // enum(textFrame, image, video, audio, book, webp, software, tapestry)
    this.url = url || ""; // used by type image, video, audio, web, software, tapestry
    this.content = content || ""; // used by type textFrame
    this.generalComments = generalComments || []; // not currently being used?
    this.specificComments = []; // not currently being used?
    this.dateCreated = new Date();
    this.dateUpdated = new Date(); // not currently being used?
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 1;
    this.height = height || 1;
    this.clippingSetting = clippingSetting; // not currently being used.
    this.linksTo = linksTo || []; // array of IDs of other items in the same tapestry
    this.googleLinksTo = googleLinksTo || []; // this is the possibly non-UUID data from Google, to be turned into linksTo
    this.googleId = googleId || uuid; // this is the ID given by the user in Google Sheets, used to link other items in Google Sheets
    this.hideTitle = Boolean(hideTitle);
    this.thumbnail = thumbnail || "";
  }
}

export default Item;
