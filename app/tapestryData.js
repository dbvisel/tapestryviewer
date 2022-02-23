import Tapestry from "./models/tapestry";
import Item from "./models/item";

// make a new tapestry.

const alex = new Tapestry({
  title: "Alex",
  slug: "alex",
  author: "Dan Visel",
  forkable: true,
  published: "published",
});

// make a new version of it – this adds an entry to its history

alex.createNewVersion();

// add another item to its history

alex.createNewVersion();

// fork it and make a new tapestry with a new title and author

const bertha = alex.fork({ newTitle: "Bertha", newAuthor: "Sally" });

// make two items – these are, by default, text frames.

const item1 = new Item({ title: "Item 1", content: "This is text frame #1" });
const item2 = new Item({ title: "Item 2", content: "This is text frame #2" });

// add the two items to the second tapestry.

bertha.addItem(item1);
bertha.addItem(item2);

// fork the first tapestry again.

const chris = alex.fork({ newSlug: "secondFork" });

// fork the second tapesty.

const doris = bertha.fork({});

// make another new text frame and add it to the newly created tapestry.

const item3 = new Item({ title: "Item 3", content: "This is text frame #3" });
doris.addItem(item3);

// make a new tapestry from scratch.

const ernest = new Tapestry({ title: "Ernest", forkable: false });

// change the publication status of that tapestry.

ernest.publish("publicWithLink");

// send all of these tapestries out as data for the rest of the site.

const tapestries = [alex, bertha, chris, doris, ernest];

export async function getTapestries() {
  return tapestries;
}

export async function getTapestryFromSlug(slug) {
  return tapestries.find((t) => t.slug === slug);
}
