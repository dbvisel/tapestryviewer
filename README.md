# tapestryviewer

This site is made using [Remix](https://remix.run) and React. There's a deployment on [Netlify](https://tapestryviewer.netlify.app).

To build, run:

```
npm start
```

You might need to install `netlify-cli` and login to Netlify to run it locally.

Data is set up in `/app/tapestryData.js`. Right now that demonstrates creating a few tapestry objects, forking them, adding items to them, and setting publication status. 

Data can also be pulled in from a [Google sheet](https://docs.google.com/spreadsheets/d/1EfdUXGmHdiJ5gcqZn4LdBJuXB0L6QZvKe3Vd7RP33SM/edit?usp=sharing). This is not currently done on build, but is done manually; to do that, run:

```
npm run download
```