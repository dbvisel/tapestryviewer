import { useState } from "react";
import { slugify } from "~/utils/utils.mjs";
import makerStyles from "~/styles/maker.css";
import { v4 as uuidv4 } from "uuid";
import AddTapestryItem from "~/components/AddTapestryItem";
import DemoGrid from "~/components/DemoGrid";

// TODO:
// - make adding items work
// - top should start with a list of tapestries – if you choose one, it should list all of the items in the tapestry
// - connect to Google Spreadsheet: https://github.com/sw-yx/netlify-google-spreadsheet-demo
//   - need to mod that to work with multiple sheets

export const links = () => {
  return [{ rel: "stylesheet", href: makerStyles }];
};

export default function MakerPage() {
  const [gridUnitSize, setGridUnitSize] = useState(200);
  const [gridGap, setGridGap] = useState(20);
  const [segments, setSegments] = useState([]);
  const [tapestryDetails, setTapestryDetails] = useState({});
  const [focusedItem, setFocusedItem] = useState({});
  const [flag, setFlag] = useState(false);
  const [message, setMessage] = useState("");
  const handleTapestrySubmit = (e) => {
    e.preventDefault();
    const {
      title,
      slug,
      author,
      background,
      backgroundColor,
      gridUnitSize,
      gridGap,
    } = e.target;
    const row = {
      title: title.value || "New tapestry",
      slug: slugify(slug.value) || slugify(title.value) || uuidv4(),
      id: slugify(slug.value) || slugify(title.value),
      author: author.value || "Tapestry author",
      background: background.value || backgroundColor.value,
      gridUnitSize: gridUnitSize,
      gridGap: gridGap,
    };
    setTapestryDetails(row);
    setMessage(JSON.stringify(row));
  };
  const addSegment = (e) => {
    e.preventDefault();
    const defaultTitle = "Item " + (segments.length + 1);
    const thisItem = {
      id: uuidv4(4),
      title: defaultTitle,
      slug: slugify(defaultTitle),
    };
    setFocusedItem(thisItem);
    setSegments([...segments, thisItem]);
  };

  return (
    <div className="makerpage">
      <h1>Tapestry Maker: Add new tapestry</h1>
      <form onSubmit={handleTapestrySubmit}>
        <div>
          <h2>Tapestry details</h2>
          <p className="twoinputs">
            <label>
              Title: <input type="text" name={"title"} />
            </label>
            <label>
              Slug: <input type="text" name={"slug"} />
            </label>
          </p>
          <p className="twoinputs">
            <label>
              Author: <input type="text" name={"author"} />
            </label>
            <label>
              Background: <input type="text" name={"background"} />
              <input type="color" name={"backgroundColor"} />
            </label>
          </p>
          <p className="twoinputs">
            <label>
              Grid unit size:
              <input
                type="number"
                name={"gridUnitSize"}
                value={gridUnitSize}
                onChange={(e) => setGridUnitSize(parseInt(e.target.value, 10))}
              />
            </label>
            <label>
              Grid gap:
              <input
                type="number"
                name={"gridGap"}
                value={gridGap}
                onChange={(e) => setGridGap(parseInt(e.target.value, 10))}
              />
            </label>
          </p>
          <DemoGrid
            key={`flag_${flag}`}
            items={segments}
            focused={focusedItem}
            gridGap={gridGap}
            gridUnitSize={gridUnitSize}
          />
          <hr style={{ marginTop: "2em" }} />
          <div>
            <h2>Items</h2>
            {segments.length ? (
              segments.map((segment, index) => (
                <AddTapestryItem
                  key={segment.id}
                  items={segments}
                  itemData={segment}
                  index={index}
                  deleteSelf={(x) => {
                    const newSegments = segments.filter((y) => y.id !== x);
                    setSegments(newSegments);
                  }}
                  setItemData={(x) => {
                    const newSegments = segments;
                    newSegments[index] = x;
                    setSegments(newSegments);
                    setFocusedItem(x);
                    setFlag(!flag);
                  }}
                />
              ))
            ) : (
              <p>No items yet!</p>
            )}
            <hr width={"50%"} />
            <button onClick={addSegment}>Add new item</button>
          </div>
          <hr style={{ marginTop: "2em" }} />
          <input type="submit" value="Submit" />
          {message ? <p>{message}</p> : null}
        </div>
      </form>
    </div>
  );
}
