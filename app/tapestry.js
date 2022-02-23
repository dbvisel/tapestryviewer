import Tapestry from "./models/tapestry";

const bob = new Tapestry({
  title: "Bob",
  slug: "bob",
  author: "Dan",
  forkable: true,
  published: "published",
});
// await new Promise(res => setTimeout(res, 1000));
bob.createNewVersion();
// await new Promise(res => setTimeout(res, 1000));
bob.createNewVersion();
const al = bob.fork({ newAuthor: "Sally" });
al.addItem("first item");
al.addItem("second item");
const al2 = bob.fork({ newSlug: "secondFork" });
const al3 = al.fork({});
const jimmy = new Tapestry({ title: "Tapestry 3", forkable: false });
const tapestries = [bob, al, al2, al3, jimmy];

export async function getTapestries() {
  return tapestries;
}

export async function getTapestryFromSlug(slug) {
  return tapestries.find((t) => t.slug === slug);
}
