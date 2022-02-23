const { GoogleSpreadsheet } = require("google-spreadsheet");
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

const manualTapestries = [alex, bertha, chris, doris, ernest];

// get google spreadsheets

const getGoogleSpreadsheetData = async () => {
  console.log("Getting Google data");
  const googleTapestries = [];
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
  doc.useApiKey(process.env.GOOGLE_API_KEY);
  await doc.loadInfo();
  const tapestrySheet = doc.sheetsByIndex[0];
  const itemSheet = doc.sheetsByIndex[1];
  const tapestryRows = await tapestrySheet.getRows();
  const itemRows = await itemSheet.getRows();
  for (let i = 0; i < tapestryRows.length; i++) {
    const thisTapestryRow = tapestryRows[i];
    const thisId = thisTapestry.id;
    const thisTapestry = new Tapestry({
      title: thisTapestryRow.title,
      slug: thisTapestryRow.slug,
      author: thisTapestryRow.author,
      forkable: Boolean(thisTapestryRow.forkable),
      items: [],
    });
    for (let j = 0; j < itemRows.length; j++) {
      const thisItemRow = itemRows[j];
      const thisItemId = thisItemRow.tapestryId;
      if (thisItemId === thisId) {
        const thisItem = new Item({
          title: thisItemRow.title,
          content: thisItemRow.content,
          type: thisItemRow.type,
        });
        thisTapestry.addItem(thisItem);
      }
    }

    googleTapestries[googleTapestries.length] = thisTapestry;
  }
  return googleTapestries;
};

// TODO: figure out how to make sure that query is only executed once per build

export async function getTapestries() {
  const googleTapestries = []; //await getGoogleSpreadsheetData();
  const tapestries = [...manualTapestries, ...googleTapestries];
  return tapestries;
}

export async function getTapestryFromSlug(slug) {
  const googleTapestries = []; // await getGoogleSpreadsheetData();
  const tapestries = [...manualTapestries, ...googleTapestries];
  console.log(slug);
  return tapestries.find((t) => t.slug === slug);
}
