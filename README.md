# tapestryviewer

This site is made using [Remix](https://remix.run). There's a deployment on [Netlify](https://tapestryviewer.netlify.app).

To build, run:

```
npm start
```

You might need to install `netlify-cli` and login.

Data is set up in `/app/tapestryData.js`. Right now that demonstrates creating a few tapestry objects, forking them, adding items to them, and setting publication status. That will be changed to pull in tapestry and item data from a Google sheet.