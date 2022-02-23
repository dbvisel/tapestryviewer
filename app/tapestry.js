import Tapestry from "./models/tapestry";
import Item from "./models/item";

const alex = new Tapestry({
  title: "Alex",
  slug: "alex",
  author: "Dan Visel",
  forkable: true,
  published: "published",
});
// await new Promise(res => setTimeout(res, 1000));
alex.createNewVersion();
// await new Promise(res => setTimeout(res, 1000));
alex.createNewVersion();
const bertha = alex.fork({ newTitle: "Bertha", newAuthor: "Sally" });
const item1 = new Item({ title: "Item 1", content: "This is text frame #1" });
const item2 = new Item({ title: "Item 2", content: "This is text frame #2" });
bertha.addItem(item1);
bertha.addItem(item2);
const chris = alex.fork({ newSlug: "secondFork" });
const doris = bertha.fork({});
const item3 = new Item({ title: "Item 3", content: "This is text frame #3" });
doris.addItem(item3);
const ernest = new Tapestry({ title: "Ernest", forkable: false });
const tapestries = [alex, bertha, chris, doris, ernest];

export async function getTapestries() {
  return tapestries;
}

export async function getTapestryFromSlug(slug) {
  return tapestries.find((t) => t.slug === slug);
}
