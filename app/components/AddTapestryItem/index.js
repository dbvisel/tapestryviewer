import { useState, useEffect } from "react";

const AddTapestryItem = ({ itemData, setItemData, items, deleteSelf }) => {
  const [title, setTitle] = useState(itemData.title);
  const [slug, setSlug] = useState(itemData.slug);
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
      slug: slug,
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
    slug,
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
    <div className="item" id={itemData.id}>
      <h3>
        {title || "untitled"}
        <button onClick={() => deleteSelf(itemData.id)}>
          Delete this item
        </button>
      </h3>
      <p className="twoinputs">
        <label>
          Title:
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label>
          ID:
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
      </p>
      <p className="twoinputs">
        <label>
          Type:
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            defaultValue="textframe"
          >
            <option value="textFrame">Text frame</option>
            <option value="tapestry">Tapestry</option>
            <option value="book">Book</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
            <option value="web">Web page</option>
          </select>
        </label>
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
            onChange={(e) => setX(e.target.value)}
          />
        </label>
        <label>
          y:
          <input
            type="number"
            value={y}
            onChange={(e) => setY(e.target.value)}
          />
        </label>
        <label>
          Width:
          <input
            type="number"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
          />
        </label>{" "}
        <label>
          Height:{" "}
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
          />
        </label>
      </p>
      <p className="twoinputs">
        <label>
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
          >
            {items
              .filter((x) => x.id !== itemData.id)
              .map((item, index) => (
                <option key={index} value={item.slug}>
                  {item.title}
                </option>
              ))}
          </select>
        </label>
        <label>
          Hide the title?
          <select
            value={hideTitle}
            onChange={(e) => setHideTitle(Boolean(e.target.value))}
          >
            <option value={false}>No</option>
            <option value={true}>Yes</option>
          </select>
        </label>
      </p>
    </div>
  );
};

export default AddTapestryItem;
