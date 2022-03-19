// const { GoogleSpreadsheet } = require("google-spreadsheet");
import Tapestry from "./models/tapestry.mjs";
import Item from "./models/item.mjs";
import googleData from "./data/googledata.json";

console.log("running tapestrydata.js");

// make a new tapestry.

// const alex = new Tapestry({
//   title: "Alex",
//   slug: "alex",
//   author: "Dan Visel",
//   forkable: true,
//   published: "published",
//   background: "none",
// });

// make a new version of it – this adds an entry to its history

// alex.createNewVersion();

// add another item to its history

// alex.createNewVersion();

// fork it and make a new tapestry with a new title and author

// const bertha = alex.fork({ newTitle: "Bertha", newAuthor: "Sally" });

// make two items – these are, by default, text frames.

// const item1 = new Item({
//   title: "Item 1",
//   content:
//     "This is text frame #1 on Bertha. Bertha was forked from Alex, but it doesn't have all of Alex's things because things were added to Alex after Bertha was created.",
//   x: 1,
//   y: 1,
//   width: 2,
//   height: 1,
// });
// const item2 = new Item({
//   title: "Item 2",
//   content:
//     "These two frames were added to Bertha after Bertha was created; you won't see them on Alex, because when Bertha was created, Alex didn't actually have any items!",
//   x: 1,
//   y: 3,
//   width: 1,
//   height: 2,
// });

// add the two items to the second tapestry.

// bertha.addItem(item1);
// bertha.addItem(item2);

// add a link on bertha back to Alex.

// const berthaTapestryLink = new Item({
//   title: "Link to Alex",
//   type: "tapestry",
//   url: "alex",
//   x: 4,
//   y: 3,
// });

// bertha.addItem(berthaTapestryLink);

// fork the first tapestry again.

// const chris = alex.fork({ newSlug: "secondFork" });

// const audioItem = new Item({
//   title: "Audio clip",
//   width: 4,
//   height: 1,
//   x: 1,
//   y: 1,
//   url: "https://archive.org/embed/stereolab-series-2/111+The+Noise+Of+Carpet+-+1996-04-28+Troubadour+LA.flac",
//   type: "audio",
// });

// const imageItem = new Item({
//   title: "Image",
//   type: "image",
//   url: "https://archive.org/embed/Desert_201303",
//   x: 1,
//   y: 2,
//   width: 4,
//   height: 3,
// });

// const webItem = new Item({
//   title: "A Wayback Machine embed",
//   type: "web",
//   url: "https://web.archive.org/web/19961219003318/http://voyagerco.com/projects/",
//   x: 5,
//   y: 1,
//   width: 3,
//   height: 4,
// });

// chris.addItem(audioItem);
// chris.addItem(imageItem);
// chris.addItem(webItem);

// fork the second tapesty.

// const doris = bertha.fork({ newTitle: "Doris" });

// make another new text frame and add it to the newly created tapestry.

// const item3 = new Item({
//   title: "Item 3",
//   content: "This is text frame #3",
//   width: 2,
//   height: 2,
//   x: 5,
//   y: 1,
// });
// doris.addItem(item3);
// doris.addLink(doris.items[0].id, doris.items[1].id);
// doris.addLink(doris.items[1].id, doris.items[2].id);

// // make a new tapestry from scratch.

// const ernest = new Tapestry({
//   title: "Ernest",
//   forkable: false,
//   background: "blanchedalmond",
// });

// // change the publication status of that tapestry.

// ernest.publish("publicWithLink");

// a bunch of text frames. They're being defined in reverse order so that we have an ID to link to.
// You could also do this with the item.addLink method.

// const e8 = new Item({
//   title: "8",
//   x: 28,
//   y: 1,
//   content: "This is the last one.",
// });
// const e7 = new Item({
//   title: "7",
//   x: 7,
//   y: 1,
//   content: "Keep scrolling: there's another frame.",
//   linksTo: [e8.id],
// });
// const e6 = new Item({ title: "6", x: 6, y: 2, linksTo: [e7.id] });
// const e5 = new Item({ title: "5", x: 5, y: 3, linksTo: [e6.id] });
// const e4 = new Item({ title: "4", x: 4, y: 4, linksTo: [e5.id] });
// const e3 = new Item({ title: "3", x: 3, y: 3, linksTo: [e4.id] });
// const e2 = new Item({ title: "2", x: 2, y: 2, linksTo: [e3.id] });
// const e1 = new Item({
//   title: "1",
//   x: 1,
//   y: 1,
//   content:
//     "If the content is too wide for the page, you can scroll to see it all.",
//   linksTo: [e2.id],
// // });

// // ernest.addItem(e1);
// // ernest.addItem(e2);
// // ernest.addItem(e3);
// // ernest.addItem(e4);
// // ernest.addItem(e5);
// // ernest.addItem(e6);
// // ernest.addItem(e7);
// // ernest.addItem(e8);

// add a tapestry link to alex – because this is done after Alex was forked, it only shows up here.

// const tapestryLink = new Item({
//   title: "Link to Doris",
//   type: "tapestry",
//   url: "alex_fork_fork",
//   x: 3,
//   y: 3,
// });
// alex.addItem(tapestryLink);

// make another new one.

// const fiona = alex.fork({ newTitle: "Fiona", newSlug: "Fiona" });

// const fionaIntro = new Item({
//   title: "Fiona",
//   content:
//     "Like Bertha, Fiona was forked from Alex, but Fiona was forked after the link was added to Alex, so Fiona has that and Bertha doesn't.",
//   x: 1,
//   y: 1,
//   width: 3,
// });

// add in a book.

// const fionaBook = new Item({
//   title: "Computers as Theater",
//   url: "https://archive.org/embed/computersasthea000laur/mode/1up",
//   type: "book",
//   x: 1,
//   y: 2,
//   width: 2,
//   height: 3,
// });

// fiona.addItem(fionaIntro);
// fiona.addItem(fionaBook);

// const george = new Tapestry({
//   title: "George",
//   forkable: false,
//   background: "beige",
// });

// send all of these tapestries out as data for the rest of the site.

const manualTapestries = [
  /*alex, bertha, chris, doris, ernest, fiona, george*/
];

// get google spreadsheets

const getDownloadedGoogleData = async () => {
  const googleTapestries = [];
  const listOfGoogleIds = [];
  for (let i = 0; i < googleData.tapestryRows.length; i++) {
    const thisTapestryRow = googleData.tapestryRows[i];
    const thisTapestry = new Tapestry({
      title: thisTapestryRow.title,
      slug: thisTapestryRow.slug,
      author: thisTapestryRow.author,
      forkable: Boolean(thisTapestryRow.forkable),
      background: thisTapestryRow.background,
      gridGap: thisTapestryRow.gridGap,
      gridUnitSize: thisTapestryRow.gridUnitSize,
      items: [],
      googleId: thisTapestryRow.googleId,
    });
    const thisId = thisTapestryRow.id;

    for (let j = 0; j < googleData.itemRows.length; j++) {
      const thisItemRow = googleData.itemRows[j];
      const thisItemId = thisItemRow.tapestryId;
      if (thisItemId === thisId) {
        const thisItem = new Item({
          title: thisItemRow.title,
          content: thisItemRow.content,
          type: thisItemRow.type,
          x: thisItemRow.x,
          y: thisItemRow.y,
          width: thisItemRow.width,
          height: thisItemRow.height,
          url: thisItemRow.url,
          googleLinksTo: thisItemRow.linksTo, // this is still uncleaned!
          googleId: thisItemRow.id, // why is this not coming thorough?n
          hideTitle: thisItemRow.hideTitle,
        });
        listOfGoogleIds[thisItemRow.id] = thisItem.id;
        thisTapestry.addItem(thisItem);
      }
    }

    // now, add in all the links

    for (let j = 0; j < thisTapestry.items.length; j++) {
      if (thisTapestry.items[j].googleLinksTo.length) {
        // console.log("\n\n\n", thisTapestry.title, thisTapestry.items[j].title);
        for (let k = 0; k < thisTapestry.items[j].googleLinksTo.length; k++) {
          const thisGoogleLink = thisTapestry.items[j].googleLinksTo[k];
          // console.log(thisTapestry.title, thisGoogleLink);
          const toLink = thisTapestry.items.find(
            (x) => x.googleId === thisGoogleLink
          );
          if (toLink) {
            // console.log(thisTapestry.items[j].id, toLink.id);
            thisTapestry.addLink(thisTapestry.items[j].id, toLink.id);
          }
          // else {
          //   console.log("Can't find", thisGoogleLink);
          // }
        }
      }
    }
    googleTapestries[googleTapestries.length] = thisTapestry;
  }

  return googleTapestries;
};

export async function getTapestries() {
  const googleTapestries = await getDownloadedGoogleData();
  const tapestries = [...manualTapestries, ...googleTapestries];
  return tapestries;
}

export async function getTapestryFromSlug(slug) {
  const googleTapestries = await getDownloadedGoogleData();
  const tapestries = [...manualTapestries, ...googleTapestries];
  return tapestries.find((t) => t.slug === slug) || null;
}
