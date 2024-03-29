import { v4 as uuidv4 } from "uuid";
import { slugify, hashString } from "../utils/utils.mjs";

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
    generalComments,
    published,
    forkedFrom,
    forkable,
    gridUnitSize,
    gridGap,
    googleId,
    hideOnFront,
    initialView,
    initialX,
    initialY,
    initialHeight,
  }) {
    const uuid = uuidv4();
    this.id = uuid;
    this.title = title || "New Tapestry";
    this.slug = slug || slugify(this.title);
    this.icon = icon || ""; // what is the type of this? a URL?
    this.author = author || "anonymous"; // fallback shouldn't actually be possible.
    this.dateCreated = new Date();
    this.dateUpdated = new Date();
    this.background = background || null; // what is the type on this?
    this.showTitleOnPage = Boolean(showTitleOnPage) || false;
    this.defaultZoom = defaultZoom || 1;
    this.items = items || [];
    this.generalComments = generalComments || [];
    this.published = published || "private";
    this.forkedFrom = forkedFrom || "";
    this.forkable = Boolean(forkable);
    this.gridUnitSize = Number(gridUnitSize) || 200;
    this.gridGap = Number(gridGap) || 20;
    this.history = [];
    this.googleId = googleId || uuid;
    this.hideOnFront = hideOnFront || false;
    this.initialView = initialView || false;
    this.initialX = initialX || 0;
    this.initialY = initialY || 0;
    this.hash = hashString(`${title || "New Tapestry"}_${author}`);
  }
  createNewVersion = () => {
    const newState = JSON.parse(JSON.stringify(this));
    delete newState.history;
    newState.dateUpdated = new Date();
    this.history.push(newState);
    this.dateUpdated = new Date();
  };
  addItem = (item) => {
    this.createNewVersion();
    const newItemList = JSON.parse(JSON.stringify(this.items));
    const itemHash = hashString(
      `${this.title}_${item.title}_${item.url}_${item.content}_${item.type}`
    );
    newItemList[newItemList.length] = { ...item, hash: itemHash };
    this.items = newItemList;
  };
  addLink = (fromId, toId) => {
    const myItemIds = this.items.map((item) => item.id);
    if (myItemIds.indexOf(fromId) > -1 && myItemIds.indexOf(toId) > -1) {
      // console.log("Creating link from " + fromId + " to " + toId);
      this.createNewVersion();
      const newLinks = JSON.parse(JSON.stringify(this.items));
      newLinks[myItemIds.indexOf(fromId)].linksTo.push(toId);
      this.items = newLinks;
    }
  };
  fork = ({ newAuthor, newSlug, newTitle }) => {
    // TODO: if a tapestry has been forked, shouldn't it retain a record of where it has been forked to?

    if (this.forkable) {
      const uuid = uuidv4();
      const newTapestry = new Tapestry({
        title: newTitle || this.title + " fork",
        slug: newSlug || this.slug + "_fork",
        icon: this.icon,
        id: uuid,
        author: newAuthor || this.author,
        background: this.background,
        showTitleOnPage: this.showTitleOnPage,
        defaultZoom: this.defaultZoom,
        items: this.items,
        generalComments: this.generalComments,
        published: false,
        forkedFrom: this.id,
        forkable: this.forkable,
        initialView: this.initialView,
        initialX: this.initialX,
        initialY: this.initialY,
        hideOnFront: this.hideOnFront,
        googleId: uuid,
        history: [],
      });
      return newTapestry;
    }
    console.error("Can't fork tapestry!");
    return null;
  };
  publish = (publishState) => {
    if (
      publishState === "published" ||
      publishState === "private" ||
      publishState === "publicWithLink"
    ) {
      this.createNewVersion();
      this.published = publishState;
    }
  };
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
  // probably this should be a tree?
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
