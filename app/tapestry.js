import Tapestry from "./models/tapestry";

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
bertha.addItem("first item");
bertha.addItem("second item");
const chris = alex.fork({ newSlug: "secondFork" });
const doris = bertha.fork({});
const ernest = new Tapestry({ title: "Ernest", forkable: false });
const tapestries = [alex, bertha, chris, doris, ernest];

export async function getTapestries() {
  return tapestries;
}

export async function getTapestryFromSlug(slug) {
  return tapestries.find((t) => t.slug === slug);
}
