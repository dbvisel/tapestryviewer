import { useState, useEffect, Fragment } from "react";
import TapestryItem from "~/components/TapestryItem";
import { getColor } from "~/utils/utils.mjs";

const AddTapestryItem = ({
  itemData,
  setItemData,
  gridUnitSize,
  items,
  deleteSelf,
  color,
}) => {
  const [title, setTitle] = useState(itemData.title);
  const [type, setType] = useState(itemData.type || "iaresource");
  const [content, setContent] = useState(itemData.content || "");
  const [url, setUrl] = useState(itemData.url || "");
  const [x, setX] = useState(itemData.x || 1);
  const [y, setY] = useState(itemData.y || 1);
  const [width, setWidth] = useState(itemData.width || 1);
  const [height, setHeight] = useState(itemData.height || 1);
  const [linksTo, setLinksTo] = useState(itemData.linksTo || []);
  const [hideTitle, setHideTitle] = useState(itemData.hideTitle || false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setItemData({
      ...itemData,
      id: itemData.id,
      title: title,
      // slug: slug,
      type: type,
      content: content,
      url: url,
      x: x,
      y: y,
      height: height,
      width: width,
      linksTo: linksTo,
      hideTitle: hideTitle,
    });
  }, [
    title,
    // slug,
    type,
    content,
    url,
    x,
    y,
    width,
    height,
    linksTo,
    hideTitle,
  ]);

  useEffect(async () => {
    if (type === "iaresource" && url) {
      if (url.includes("https://archive.org/")) {
        const newUrl = url.replace(
          "archive.org/details/",
          "archive.org/embed/"
        );
        const splitUrl = newUrl.split("/embed/");
        const metadataUrl =
          splitUrl[0] + "/metadata/" + splitUrl[1].split("/")[0];
        setMessage("Querying Internet Archive . . .");
        console.log(newUrl, metadataUrl);
        setUrl(newUrl);
        await fetch(metadataUrl, {
          method: "GET",
        })
          .then((res) => res.json())
          .then(async (r) => {
            console.log(r);
            if (r.metadata.title) {
              setTitle(r.metadata.title);
            }
            if (r.metadata.mediatype === "audio") {
              setType("audio");
            }
            if (r.metadata.mediatype === "movies") {
              setType("video");
            }
            if (r.metadata.mediatype === "texts") {
              setType("book");
            }
            if (r.metadata.mediatype === "image") {
              setType("image");
            }
            if (r.metadata.mediatype === "software") {
              setType("software");
            }
          })
          .catch((e) => {
            setMessage("There was an error, check the log");
            console.error(e);
          });
      }
    } else {
      setMessage("");
    }
  }, [type, url]);
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "600px 1fr",
        gridGap: "50px",
        gridTemplateAreas: '"controls preview"',
      }}
    >
      <div
        className="item"
        id={itemData.id}
        tabIndex={1}
        style={{ "--color": color }}
      >
        <h3>
          {title || "untitled"}
          <button onClick={() => deleteSelf(itemData.id)}>
            Delete this item
          </button>
        </h3>
        <p className="twoinputs">
          <label style={{ flex: 3 }}>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label style={{ flex: 1 }}>
            <input
              type="checkbox"
              checked={hideTitle}
              onChange={(e) => setHideTitle(e.target.checked)}
            />
            Hide title?
          </label>
          <label style={{ flex: 2 }}>
            Type:
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="textFrame">Text frame</option>
              <option value="tapestry">Tapestry</option>
              <option value="iaresource">IA resource</option>
              <option value="book">Book</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="web">Web page</option>
              <option value="software">Software</option>
            </select>
          </label>
        </p>
        {type === "textFrame" ? (
          <p className="twoinputs">
            <label>
              Content:
              <textarea
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={"Enter HTML here"}
              />
            </label>
          </p>
        ) : (
          <Fragment>
            <p className="twoinputs">
              <label>
                URL:
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder={
                    type === "tapestry"
                      ? "Set this to the slug of a defined tapestry"
                      : ""
                  }
                />
              </label>
            </p>
            {message ? <p>{message}</p> : null}
          </Fragment>
        )}
        <p className="twoinputs">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              marginRight: "25px",
            }}
          >
            <label>
              x:
              <input
                type="number"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value, 10))}
              />
            </label>
            <label style={{ marginLeft: 0 }}>
              y:
              <input
                type="number"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value, 10))}
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
              Width:
              <input
                type="number"
                value={width}
                onChange={(e) => setWidth(parseInt(e.target.value, 10))}
              />
            </label>{" "}
            <label style={{ marginLeft: 0 }}>
              Height:{" "}
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value, 10))}
              />
            </label>
          </div>
          <label style={{ flex: 2 }}>
            Links to:
            <select
              multiple
              value={linksTo}
              onChange={(e) => {
                const value = Array.from(
                  e.target.selectedOptions,
                  (option) => option.value
                );

                setLinksTo(value);
              }}
              style={{ height: `${6 + 18 * items.length}px` }}
            >
              {items
                .filter((x) => x.id !== itemData.id)
                .map((item, index) => (
                  <option
                    key={index}
                    value={item.id}
                    className="linkselector"
                    style={{
                      "--color": getColor(
                        items.map((x) => x.id).indexOf(item.id)
                      ),
                    }}
                    data-index={items.map((x) => x.id).indexOf(item.id) + 1}
                  >
                    {item.title}
                  </option>
                ))}
            </select>
          </label>
        </p>
        <hr style={{ width: "50%", marginLeft: "25%" }} />
      </div>
      <div
        style={{
          gridArea: "preview",
          display: "grid",
          gridTemplateColumns: `${width * gridUnitSize}px`,
          gridTemplateRows: `${height * gridUnitSize}px`,
          marginBottom: "25px",
        }}
      >
        <TapestryItem item={itemData} preview />
      </div>
    </div>
  );
};

export default AddTapestryItem;
