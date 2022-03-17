import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const AddTapestryItem = ({
  itemData,
  setItemData,
  items,
  deleteSelf,
  color,
}) => {
  const [title, setTitle] = useState(itemData.title);
  // const [slug, setSlug] = useState(itemData.slug);
  const [type, setType] = useState(itemData.type || "textFrame");
  const [content, setContent] = useState(itemData.content || "");
  const [url, setUrl] = useState(itemData.url || "");
  const [x, setX] = useState(itemData.x || 1);
  const [y, setY] = useState(itemData.y || 1);
  const [width, setWidth] = useState(itemData.width || 1);
  const [height, setHeight] = useState(itemData.height || 1);
  const [linksTo, setLinksTo] = useState(itemData.linksTo || []);
  const [hideTitle, setHideTitle] = useState(itemData.hideTitle || false);

  useEffect(() => {
    setItemData({
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

  return (
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
            value={hideTitle}
            onChange={(e) => setHideTitle(e.target.checked)}
          />
          Hide title?
        </label>
        <label style={{ flex: 2 }}>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="textFrame">Text frame</option>
            <option value="tapestry">Tapestry</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="image">Image</option>
            <option value="audio">Audio</option>
            <option value="web">Web page</option>
          </select>
        </label>
      </p>
      <p className="twoinputs">
        {type === "textFrame" ? (
          <label>
            Content:
            <textarea
              type="text"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={"Enter HTML here"}
            />
          </label>
        ) : (
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
        )}
      </p>
      <p className="twoinputs">
        <label>
          x:
          <input
            type="number"
            value={x}
            onChange={(e) => setX(parseInt(e.target.value, 10))}
          />
        </label>
        <label>
          y:
          <input
            type="number"
            value={y}
            onChange={(e) => setY(parseInt(e.target.value, 10))}
          />
        </label>
        <label>
          Width:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(parseInt(e.target.value, 10))}
          />
        </label>{" "}
        <label>
          Height:{" "}
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(parseInt(e.target.value, 10))}
          />
        </label>
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
                <option key={index} value={item.id}>
                  {item.title}
                </option>
              ))}
          </select>
        </label>
      </p>
      <hr style={{ width: "50%", marginLeft: "25%" }} />
    </div>
  );
};

export default AddTapestryItem;
