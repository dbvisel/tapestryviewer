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

## Google sheet instructions

There are two sheets, **tapestries** and **items**. *Tapestries* defines the tapestries to be imported. *Items* defines the items to be imported. Items are connected to a tapestry by _tapestryId_, which should match _id_ on a tapestry. These IDs are only used to connect items; it's fine to have a tapestry without an ID, though an item without an ID won't show up in the viewer. 

For tapestries, **background** can be any valid CSS _background_ value – i.e a color name, a hex code, a URL, a gradient, or _none_ (the default). **slug** is what the tapestry's URL should be; this doesn't need to be unique, but it will be made unique if it is not on import. This is only really important if you need to link to the tapestry.

For items, **type** can currently be:

 - **textFrame**, a text frame; if this is chosen, set _content_ to whatever HTML you want to appear in the frame. 
 - **book**, an Internet Archive book; if this is chosen, set _url_ to the book's URL. The form _https://archive.org/embed/xxxxxxxx/mode/1up_ works pretty well.
 - **tapestry**, another tapestry; if this is chosen, set _url_ to the slug of another tapestry, making sure that that slug is unique.

### Grids

Items are laid out by grids. The grid is made of squares and gaps between the squares. By default, each item is 1 unit wide and 1 unit high; the default start point is (1,1). The grid does not currently attempt to deal with overlaps, which are a possiblity when adding with a Google Sheet. The default grid is 200px x 200px, with a gap of 20px between squares. Soon this will be adjustable on a per-tapestry level.

If a tapestry's grid is larger than the viewport, it grows scrollbars. Because of the way CSS grids work, you can't currently have negative _x_ and _y_ values (though this could theoretically be accommodated).

To put an item at a specific point in the grid, set _x_ and _y_ to the desired values; the default for both is 1. If _width_ and _height_ are not set, they also default to 1.

### Links

To make a link from one item to another item, put the linked item's ID in the **linksTo** field of the linking item. You can link to multiple items; separate them with commas: _item1,item2_.

## TODO:
- add in images
- add in audio
- set grid unit/gap as tapestry settings
- move nav/settings to drawers
- add in focus
