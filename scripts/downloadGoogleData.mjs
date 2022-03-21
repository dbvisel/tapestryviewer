import "dotenv/config";
import fs from "fs";
import { GoogleSpreadsheet } from "google-spreadsheet";
// import Tapestry from "./../app/models/tapestry.mjs";
// import Item from "./../app/models/item.mjs";

console.log("Getting Google data");
const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_ID);
doc.useApiKey(process.env.GOOGLE_API_KEY);
await doc.loadInfo();
const tapestrySheet = doc.sheetsByIndex[0];
const itemSheet = doc.sheetsByIndex[1];
const tapestryRows = await tapestrySheet.getRows();
const itemRows = await itemSheet.getRows();
// const googleTapestries = [];
// for (let i = 0; i < tapestryRows.length; i++) {
//   const thisTapestryRow = tapestryRows[i];
//   const thisTapestry = new Tapestry({
//     title: thisTapestryRow.title,
//     slug: thisTapestryRow.slug,
//     author: thisTapestryRow.author,
//     forkable: Boolean(thisTapestryRow.forkable),
//     items: [],
//   });
//   const thisId = thisTapestry.id;
//   for (let j = 0; j < itemRows.length; j++) {
//     const thisItemRow = itemRows[j];
//     const thisItemId = thisItemRow.tapestryId;
//     if (thisItemId === thisId) {
//       const thisItem = new Item({
//         title: thisItemRow.title,
//         content: thisItemRow.content,
//         type: thisItemRow.type,
//       });
//       thisTapestry.addItem(thisItem);
//     }
//   }

//   googleTapestries[googleTapestries.length] = thisTapestry;
// }
const slugList = [];
const outTapestryRows = tapestryRows.map((x) => {
  const thisSlug =
    slugList.indexOf(x.slug) > -1 ? x.slug + "_" + slugList.length : x.slug;
  slugList[slugList.length] = thisSlug;
  return {
    id: x.id,
    title: x.title,
    slug: thisSlug,
    author: x.author,
    forkable: Boolean(x.forkable),
    background: x.background,
    gridUnitSize: Number(x.gridUnitSize),
    gridGap: Number(x.gridGap),
  };
});
const outItemRows = itemRows.map((x) => {
  return {
    tapestryId: x.tapestryId,
    id: x.id,
    title: x.title,
    content: x.content,
    url: x.url,
    type: x.type,
    x: Number(x.x),
    y: Number(x.y),
    width: Number(x.width),
    height: Number(x.height),
    linksTo: x.linksTo ? x.linksTo.split(",") : [],
    hideTitle: Boolean(x.hideTitle === "TRUE"),
    thumbnail: x.thumbnail,
  };
});
const googleTapestries = {
  itemRows: outItemRows,
  tapestryRows: outTapestryRows,
};
// console.log(googleTapestries.itemRows);

fs.writeFile(
  "./app/data/googledata.json",
  JSON.stringify(googleTapestries),
  (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("File written.");
  }
);
