import { useState, useEffect, memo } from "react";
import { v4 as uuidv4 } from "uuid";
import { slugify } from "~/utils/utils.mjs";

const AddItems = ({ setAddItems, segments, setSegments, id }) => {
  const [items, setItems] = useState("");
  const [itemList, setItemList] = useState([]);
  const [itemX, setItemX] = useState(0);
  const [itemY, setItemY] = useState(0);
  const [itemWidth, setItemWidth] = useState(1);
  const [itemHeight, setItemHeight] = useState(1);
  const [itemXOffset, setItemXOffset] = useState(1);
  const [itemYOffset, setItemYOffset] = useState(0);
  const initialSegments = segments.filter((x) => x.recent !== id);

  // TODO: This is rerendering too often.

  useEffect(() => {
    setItemList(items.split("\n").filter((x) => x));
  }, [items]);

  // useEffect(() => {

  // }, [itemList, itemX, itemY, itemWidth, itemHeight, itemXOffset, itemYOffset]);

  // console.log("rendering addItems");

  // console.log(segments, initialSegments, id);
  return (
    <div className="item" style={{ marginTop: "2em" }}>
      <h2>Adding multiple items</h2>
      <p>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          Enter item URLs, each on its own line:
          <textarea
            value={items}
            onChange={(e) => setItems(e.target.value)}
            style={{ margin: "1em 0" }}
          />
        </label>
      </p>
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
                    ? (itemWidth + itemXOffset - 1) * i + 1
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
            setAddItems("");
          }}
        >
          Set
        </button>
        <button
          style={{ marginTop: "20px" }}
          onClick={(e) => {
            e.preventDefault();
            setSegments(initialSegments);
            setAddItems("");
          }}
        >
          Cancel
        </button>
      </p>
    </div>
  );
};

export default memo(AddItems);
