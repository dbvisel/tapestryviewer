import { useState, useEffect, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "~/utils/utils.mjs";

// TOOO: would probably be useful to limit this in some way?

const AddLinks = ({ setAddCollection, segments, setSegments, id }) => {
  const [url, setUrl] = useState(""); // e.g. "https://archive.org/details/3dworldmagazine"
  const [itemList, setItemList] = useState([]);
  const [message, setMessage] = useState("");
  const [itemX, setItemX] = useState(0);
  const [itemY, setItemY] = useState(0);
  const [itemWidth, setItemWidth] = useState(1);
  const [itemHeight, setItemHeight] = useState(1);
  const [itemXOffset, setItemXOffset] = useState(1);
  const [itemYOffset, setItemYOffset] = useState(0);
  const initialSegments = segments.filter((x) => x.recent !== id);

  useEffect(() => {
    const checkIaResource = async () => {
      if (url) {
        // NOTE: this only finds collection IDs in the form "archive.org/details/collectionId/"
        // If there are other types, it won't find them!
        setMessage(`Checking for links on "${url}"...`);
        await fetch(`/.netlify/functions/getlinks`, {
          method: "POST",
          body: JSON.stringify({ url: url }),
        })
          .then((res) => res.json())
          .then(async (r) => {
            if (r.length) {
              setItemList(r); // r.map((x) => `https://archive.org/embed/${x}`));
              setMessage(`Found ${r.length} item${r.length > 1 ? "s" : ""}!`);
            } else {
              setMessage("No results!");
            }
          })
          .catch((e) => {
            console.error("Error querying Internet Archive: ", e);
            console.log("URL: ", url);
            setMessage("Error querying Internet Archive!");
          });
      }
    };
    checkIaResource();
  }, [url]);

  // console.log(itemList);

  return (
    <div className="item" style={{ marginTop: "2em" }}>
      <h2>Adding links</h2>
      <p>
        <label
          style={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          Enter URL to get links from:
          <input
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            style={{ marginLeft: "25px", marginRight: "25px", flex: 1 }}
          />
        </label>
      </p>
      {message ? <p className="message">{message}</p> : null}
      <div className="twoinputs">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "25px",
          }}
        >
          <label>
            Item width:
            <input
              type="number"
              value={itemWidth}
              onChange={(e) => setItemWidth(parseInt(e.target.value, 10) || 0)}
            />
          </label>{" "}
          <label style={{ marginLeft: 0 }}>
            Item height:{" "}
            <input
              type="number"
              value={itemHeight}
              onChange={(e) => setItemHeight(parseInt(e.target.value, 10) || 0)}
            />
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "25px",
          }}
        >
          <label>
            First x:
            <input
              type="number"
              value={itemX}
              onChange={(e) => setItemX(parseInt(e.target.value, 10) || 0)}
            />
          </label>
          <label style={{ marginLeft: 0 }}>
            First y:
            <input
              type="number"
              value={itemY}
              onChange={(e) => setItemY(parseInt(e.target.value, 10) || 0)}
            />
          </label>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            marginRight: "25px",
          }}
        >
          <label>
            x offset:
            <input
              type="number"
              value={itemXOffset}
              onChange={(e) =>
                setItemXOffset(parseInt(e.target.value, 10) || 0)
              }
            />
          </label>{" "}
          <label style={{ marginLeft: 0 }}>
            y offset:{" "}
            <input
              type="number"
              value={itemYOffset}
              onChange={(e) =>
                setItemYOffset(parseInt(e.target.value, 10) || 0)
              }
            />
          </label>
        </div>
      </div>
      <p>
        <button
          style={{ marginTop: "20px" }}
          onClick={(e) => {
            e.preventDefault();
            const outItems = [];
            for (let i = 0; i < itemList.length; i++) {
              const defaultTitle = "Item " + (i + 1);
              outItems[outItems.length] = {
                id: uuidv4(4),
                title: defaultTitle,
                slug: slugify(defaultTitle),
                width: itemWidth,
                height: itemHeight,
                url: itemList[i],
                recent: id,
                x:
                  itemX + itemXOffset
                    ? (itemWidth + itemXOffset - 1) * i + 1 // this is broken
                    : 0,
                y:
                  itemY + itemYOffset
                    ? (itemHeight + itemYOffset - 1) * i + 1
                    : 0,
              };
            }
            // console.log(outItems);
            setSegments(
              initialSegments.filter((x) => x.recent !== id).concat(outItems)
            );
          }}
        >
          Preview
        </button>
        <button
          style={{ marginTop: "20px" }}
          onClick={(e) => {
            e.preventDefault();
            setAddCollection("");
          }}
        >
          Set
        </button>
        <button
          style={{ marginTop: "20px" }}
          onClick={(e) => {
            e.preventDefault();
            setSegments(initialSegments);
            setAddCollection("");
          }}
        >
          Cancel
        </button>
      </p>
    </div>
  );
};

export default memo(AddLinks);
