const fetch = require("node-fetch");

// this checks if a URL is available at the internet archive

exports.handler = async (event, context) => {
  const url = JSON.parse(event.body).url;
  const theUrl = `http://archive.org/wayback/available?url=${url}`;
  // console.log(theUrl);
  let outUrl = url;
  try {
    await fetch(theUrl, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (r) => {
        if (r.archived_snapshots?.closest?.available) {
          outUrl = r.archived_snapshots.closest.url;
        }
      })
      .catch((e) => {
        console.error("Error: ", e);
        return {
          statusCode: 500,
          body: JSON.stringify(url),
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
