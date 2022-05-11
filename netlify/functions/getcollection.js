const fetch = require("node-fetch");

// this checks if a URL is available at the internet archive

exports.handler = async (event, context) => {
  const url = JSON.parse(event.body).url;
  const theUrl = `https://archive.org/services/search/v1/scrape?fields=identifier&q=collection%3A${url}`;
  // console.log(theUrl);
  let outUrl = [];
  try {
    await fetch(theUrl, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (r) => {
        // this should return
        // {"items":[{"identifier":"2001073DWorldI14"},{"identifier":"2002083DWorldI28"},{"identifier":"3DWorldDecember2017UK"}],"count":3,"total":3}
        console.log(r);
        if (r.items) {
          console.log("Found items!");
          outUrl = r.items.map((x) => x.identifier);
        } else {
          console.log("No items found!");
        }
      })
      .catch((e) => {
        console.error("Error: ", e);
        return {
          statusCode: 500,
          body: JSON.stringify([]),
        };
      });
    return {
      statusCode: 200,
      body: JSON.stringify(outUrl),
    };
  } catch (err) {
    return {
      statusCode: err.statusCode || 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
