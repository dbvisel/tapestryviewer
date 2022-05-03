import fetch from "node-fetch";

exports.handler = async (event, context) => {
  const url = JSON.parse(event.body).url;
  const theUrl = `http://web.archive.org/web/timemap/json/${url}`;
  // console.log(theUrl);
  let dates = [];
  try {
    await fetch(theUrl, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(async (r) => {
        // console.log(r);
        dates = r.slice(1).map((x) => x[1]);
        // console.log(JSON.stringify(dates));
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
      body: JSON.stringify(dates),
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
