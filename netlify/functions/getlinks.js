const got = (...args) => import("got").then(({ default: got }) => got(...args));
const cheerio = require("cheerio");

// this checks if a URL is available at the internet archive

exports.handler = async (event, context) => {
  const url = JSON.parse(event.body).url;
  // console.log(theUrl);
  let outLinks = [];
  try {
    // check if it's wikipedia
    // if so, get .mw-body-content, look in there
    const wikipediaMode = url.indexOf("wikipedia.org") > -1;
    const r = await got(url);

    const html = r.body;
    const $ = cheerio.load(html);
    const linkObjects = $(wikipediaMode ? "div.mw-body-content a" : "a");
    // this is a mass object, not an array

    const total = linkObjects.length;
    console.log("Total links: ", total);
    // The linkObjects has a property named "lenght"

    for (let i = 0; i < total; i++) {
      const thisUrl = linkObjects[i].attribs.href;
      const isAnchor = thisUrl && thisUrl[0] === "#";
      const isWikipediaInternal =
        wikipediaMode && thisUrl && thisUrl.indexOf("/w/") > -1;
      const isWikipedia =
        wikipediaMode && thisUrl && thisUrl.indexOf("/wiki/") > -1; // this is outlawing any Wikipedia internal link
      if (!isAnchor && !isWikipediaInternal && !isWikipedia) {
        outLinks.push(thisUrl);
      }
    }
    console.log("Allowed links: ", outLinks.length);
  } catch (err) {
    console.error("Error: ", err);
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({ error: err.message }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify(outLinks),
  };
};
