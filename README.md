# tapestryviewer

This site is made using [Remix](https://remix.run) and React. It's set up for deployment on Netlify, and you can find one [there](https://tapestryviewer.netlify.app). Other deployments are possible!

To build, run:

```
npm start
```

You might need to install `netlify-cli` and login to Netlify to get it running locally.

Data is set up in `/app/tapestryData.js`. Right now that demonstrates creating a few tapestry objects, forking them, adding items to them, and setting publication status. 

Data can also be pulled in from a [Google sheet](https://docs.google.com/spreadsheets/d/1EfdUXGmHdiJ5gcqZn4LdBJuXB0L6QZvKe3Vd7RP33SM/edit?usp=sharing). This is done by a prebuild script:

```
npm run prebuild
```


## Environmental variables

This is expecting to find the following, which should be in an `.env` file. From Google:

 - GOOGLE_API_KEY
 - GOOGLE_SERVICE_ACCOUNT_EMAIL
 - GOOGLE_PRIVATE_KEY (these three you can get pretty easily from the Google API console with a dev account)
 - GOOGLE_SHEETS_ID, the ID of the Google sheet that's being used for the data.

From Netlify:

 - BUILD_HOOK, the URL that a post is fired to to trigger a rebuild of the site.


## Maker

If you go to `/maker`, there's a basic tapestry maker, which lets you add data which will then be put into the Google Sheet. This is generally easier than adding data to the Google Sheet directly! However, it doesn't let you edit data saved in the Google Sheet; to do that, you still need to go into the Google Sheet.

## Google sheet instructions

There are two sheets, **tapestries** and **items**. *Tapestries* defines the tapestries to be imported. *Items* defines the items to be imported. Items are connected to a tapestry by _tapestryId_, which should match _id_ on a tapestry. These IDs are only used to connect items; it's fine to have a tapestry without an ID, though an item without an ID won't show up in the viewer. 

For tapestries, **background** can be any valid CSS _background_ value – i.e a color name, a hex code, a URL, a gradient, or _none_ (the default). **slug** is what the tapestry's URL should be; this doesn't need to be unique, but it will be made unique if it is not on import. This is only really important if you need to link to the tapestry.

For items, **type** can currently be:

 - **textFrame**, a text frame; if this is chosen, set _content_ to whatever HTML you want to appear in the frame. 
 - **book**, an Internet Archive book; if this is chosen, set _url_ to the book's URL. The form _https://archive.org/embed/xxxxxxxx/mode/1up_ works pretty well.
 - **image**, an Internet Archive image; if this is chosen, set _url_ to the image's URL. The form _https://archive.org/embed/xxxxxxxx_ works pretty well.
 - **audio**, an Internet Archive audio; if this is chosen, set _url_ to the audio's URL. The form _https://archive.org/embed/xxxxxxxx/yyyyyyyy_ works pretty well.
 - **video**, an Internet Archive video; if this is chosen, set _url_ to the video's URL. The form _https://archive.org/embed/xxxxxxxx_ works pretty well.
 - **tapestry**, another tapestry; if this is chosen, set _url_ to the slug of another tapestry, making sure that that slug is unique.
 - **web**, a Wayback Machine embed; if this is chosen, set _url_ to the Wayback Machine URL. The form _https://web.archive.org/web/datestamp/url_ works pretty well.
 - [TODO: there are more types! Fill this out.]

### Grids

Items are laid out by grids. The grid is made of squares and gaps between the squares. By default, each item is 1 unit wide and 1 unit high; the default start point is (1,1). The grid does not currently attempt to deal with overlaps, which are a possiblity when adding with a Google Sheet. The default grid is 200px x 200px, with a gap of 20px between squares. To change this, set **gridUnitSize** and **gridGap** to something different for the tapestry.

Because of the way CSS grids work, you can't currently have negative _x_ and _y_ values (though this could theoretically be accommodated).

To put an item at a specific point in the grid, set _x_ and _y_ to the desired values; the default for both is 1. If _width_ and _height_ are not set, they also default to 1.

### Links

To make a link from one item to another item, put the linked item's ID in the **linksTo** field of the linking item. You can link to multiple items; separate them with commas: _item1,item2_.

## API

Tapestries have a slug. If you have a slug like `tapestry-name`, the tapestry is at `/tapestry/tapestry-name`. If you add `/api/` to the end of that (`/tapestry/tapestry-name/api`) or swap the `/tapestry/` for `/api/` (`/api/tapestry-name`), you'll see the JSON for the tapestry. If you use `/embed/` in the same way (`/tapestry/tapestry-name/embed` or `/embed/tapestry-name`), you'll see the tapestry in an iframe and the HTML to copy to use it that way.

## Deployment

There are some configuration settings in `config.js` – base URL is most important for deployment, but also some flags that can change behavior.



## TODO:

# backend overhaul
 - supabase seems like it would be an easy way to do this?

## ui overhaul

 - make click-to-select mode
 - clarity of model
   - Safari zooming is weird – two-finger scrolling
 - work through mark/jim's comments
- make list of interactions (mouse/keyboard)
- tooltips?

From Brenton:
Proposed navigation approach for desktop
 - With nothing selected, then no matter where you are, two-finger panning on trackpad (or single-finger on Magic Mouse or scrollwheel) pans tapestry; pinch-zoom scales
 - To select an item, click anywhere on it
 - When an item is selected and the cursor is hovering over it, gestures are sent into the iframe
 - When an item is selected and the cursor is not hovering over it, the tapestry-level navigation controls are in play
 - Double-clicking anywhere on an item causes it to fill the browser frame and be selected
 - Browser reset command (e.g. command-0) causes tapestry size to reset to showing the full canvas


### api updates
 - add IA identifier to tapestry data in google import script
   - (what else needs to happen here?)

### bugs

 - control audio behaves weirdly in maker
   - also maybe in playback? 
 - is there a bug in Digital Maoism?
 - the demo grid is a mess when it's too large.
 - automatically adding links doesn't work for offsets.
 - transparent webframes hide throbber; workaround is to give them a background color, though that hides throbber entirely.
### important

 - layers
 - resize in viewer?
   - can't really do this inside of grid context?

 - move preview to iframe? Can we do this?
 - BUG: why can't we scroll text fields normally?
 - it zooms too much
   - maybe think about using this library: https://github.com/retyui/react-quick-pinch-zoom  
 - can we visually annotate images of pages of books?
 - make a demo with comments

### new potential content types
 - flickr image frame
 - video frame + caption, image + caption

### mildly important

 - movement of objects?
   - could maybe get this to work inside of the maker preview
     - can we get the preview changes to 
 - move settings to drawer rather than header
 - deletion seems to be inconsistent

### think about

 - make a version of this which works with SQLite rather than Google Sheets
 - rich text editor: maybe Lexical: https://lexical.dev (though that's still new!)
 - tv archive: right now I can't get captions because they're set to private
 - tree navigation
 - Hypothesis? Could we do that instead?
 - Is it worth moving this to fly.io so we're not entirely client-side?
   - https://fly.io/docs/getting-started/remix/
