import { v4 as uuidv4 } from "uuid";
import { slugify } from "../utils/utils";

class Tapestry {
  constructor({
    title,
    slug,
    icon,
    author,
    background,
    showTitleOnPage,
    defaultZoom,
    items,
    comments,
    published,
    forkedFrom,
    forkable,
  }) {
    this.id = uuidv4();
    this.title = title || "New Tapestry";
    this.slug = slug || slugify(this.title);
    this.icon = icon;
    this.author = author;
    this.dateCreated = new Date();
    this.dateUpdated = new Date();
    this.background = background;
    this.showTitleOnPage = showTitleOnPage || false;
    this.defaultZoom = defaultZoom || 1;
    this.items = items || [];
    this.comments = comments;
    this.published = published || "private";
    this.forkedFrom = forkedFrom || "";
    this.forkable = Boolean(forkable);
    this.history = [];
  }
  createNewVersion() {
    const newState = JSON.parse(JSON.stringify(this));
    delete newState.history;
    newState.dateUpdated = new Date();
    this.history.push(newState);
    this.dateUpdated = new Date();
  }
  addItem(item) {
    this.createNewVersion();
    const newItemList = JSON.parse(JSON.stringify(this.items));
    newItemList[newItemList.length] = item;
    this.items = newItemList;
  }
  fork({ newAuthor, newSlug, newTitle }) {
    // TODO: if a tapestry has been forked, shouldn't it retain a record of where it has been forked to?
    if (this.forkable) {
      const newTapestry = new Tapestry({
        title: newTitle || this.title + " fork",
        slug: newSlug || this.slug + "_fork",
        icon: this.icon,
        author: newAuthor || this.author,
        background: this.background,
        showTitleOnPage: this.showTitleOnPage,
        defaultZoom: this.defaultZoom,
        items: this.items,
        comments: this.comments,
        published: false,
        forkedFrom: this.id,
        forkable: this.forkable,
        history: [],
      });
      return newTapestry;
    }
    console.error("Can't fork tapestry!");
    return null;
  }
}

export const getTapestryFromId = (tapestries, id) => {
  for (let i = 0; i < tapestries.length; i++) {
    if (tapestries[i].id === id) {
      return tapestries[i];
    }
  }
};

export const getTapestryForkHistory = (tapestries, tapestry, list = []) => {
  // if these is a fork history, this returns the fork history with the newest first
  // this returns a list of tapestries or an empty list
  if (tapestry) {
    if (tapestry.forkedFrom) {
      list[list.length] = tapestry.forkedFrom;
      getTapestryForkHistory(
        tapestries,
        getTapestryFromId(tapestries, tapestry.forkedFrom),
        list
      );
    }
    return list.map((id) => getTapestryFromId(tapestries, id));
  }
  return [];
};

export const getTapestriesForkedFromThisOne = (tapestries, tapestry) => {
  // TODO: Right now this is only getting a flat list – this should be a tree.
  const list = [];
  for (let i = 0; i < tapestries.length; i++) {
    if (tapestries[i].forkedFrom === tapestry.id) {
      list[list.length] = tapestries[i];
    }
  }
  return list;
};

export default Tapestry;
