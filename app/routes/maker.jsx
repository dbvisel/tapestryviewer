import { useState } from "react";
import { Link, useLoaderData, useOutletContext } from "remix";
import { v4 as uuidv4 } from "uuid";
import { slugify, getColor } from "~/utils/utils.mjs";
import AddTapestryItem from "~/components/AddTapestryItem";
import AddItems from "~/components/AddItems";
import AddCollection from "~/components/AddCollection";
import DemoGrid from "~/components/DemoGrid";
import TapestryComponent from "~/components/TapestryComponent";
import makerStyles from "~/styles/maker.css";
import tapestryStyles from "~/styles/tapestries.css";
import megadraftStyles from "megadraft/dist/css/megadraft.css";

// TODO: on save of existing tapesty: make a new function that does a lot of puts.

const fireWebhook = async (url) => {
  console.log("firing webhook:", url);
  await fetch(url, {
    method: "POST",
  }).then((res) => {
    console.log(res);
  });
};

export const loader = () => {
  const buildhook = process.env.BUILD_HOOK;
  return { buildhook: buildhook };
};

export const links = () => {
  return [
    { rel: "stylesheet", href: tapestryStyles },
    { rel: "stylesheet", href: makerStyles },
    { rel: "stylesheet", href: megadraftStyles },
  ];
};

export default function MakerPage() {
  const { buildhook } = useLoaderData();
  const { tapestries } = useOutletContext();
  const [isNewTapestry, setIsNewTapestry] = useState(true);
  const [title, setTitle] = useState("New tapestry");
  const [slug, setSlug] = useState(slugify(title));
  const [author, setAuthor] = useState("Author");
  const [background, setBackground] = useState("none");
  const [gridUnitSize, setGridUnitSize] = useState(200);
  const [gridGap, setGridGap] = useState(20);
  const [segments, setSegments] = useState([]);
  const [focusedItem, setFocusedItem] = useState({});
  const [flag, setFlag] = useState(false);
  const [message, setMessage] = useState("");
  const [initialView, setInitialView] = useState(false);
  const [initialX, setInitialX] = useState(0);
  const [initialY, setInitialY] = useState(0);
  const [defaultZoom, setDefaultZoom] = useState(1);
  const [existingTapestry, setExistingTapestry] = useState(null);
  const [addItems, setAddItems] = useState("");
  const [addCollection, setAddCollection] = useState("");

  const handleSetTapestry = (id) => {
    if (id === "0" || id === 0) {
      setIsNewTapestry(true);
      setTitle("New tapestry");
      setAuthor("Author");
      setBackground("none");
      setGridGap(20);
      setGridUnitSize(200);
      setExistingTapestry(null);
      setSegments([]);
      return;
    }
    if (id) {
      const tapestry = tapestries.find((t) => t.id === id);
      setIsNewTapestry(false);
      setExistingTapestry(tapestry);
      setTitle(tapestry.title);
      setSlug(tapestry.slug);
      setAuthor(tapestry.author);
      setBackground(tapestry.background);
      setGridUnitSize(tapestry.gridUnitSize);
      setGridGap(tapestry.gridGap);
      setSegments(tapestry.items);
      setDefaultZoom(tapestry.defaultZoom);
      setInitialView(tapestry.initialView);
      setInitialX(tapestry.initialX);
      setInitialY(tapestry.initialY);
    }
  };

  const handleTapestrySubmit = async (e, fork) => {
    e.preventDefault();
    const row = {
      title: title || "New tapestry",
      slug: slugify(slug) || slugify(title) || uuidv4(),
      id: slugify(slug) || slugify(title),
      author: author || "Tapestry author",
      background: background,
      gridUnitSize: gridUnitSize,
      gridGap: gridGap,
      forkable: true,
      initialView: initialView,
      initialX: initialX,
      initialY: initialY,
      defaultZoom: defaultZoom,
    };
    if (fork) {
      row.title = `${row.title} fork`;
      row.slug = `${row.slug}-fork`;
      row.id = `${row.id}-fork`;
    }

    if (isNewTapestry || fork) {
      const payload = {
        tapestry: row,
        items: segments.map((segment) => {
          console.log(segment.controlList);
          return {
            ...segment,
            tapestryId: row.slug,
            linksTo: segment.linksTo.join(","), // TODO: this needs to change to an ID
            controlList:
              JSON.stringify(segment.controlList) === "[]"
                ? ""
                : JSON.stringify(segment.controlList),
          };
        }),
      };
      // console.log(payload);
      setMessage(`Sending tapestry data: \n\n ${JSON.stringify(row)}`);
      await fetch("/.netlify/functions/googlesheets", {
        method: "POST",
        body: JSON.stringify({ tapestry: payload.tapestry }),
      })
        .then((res) => res.json())
        .then(async (response) => {
          setMessage(message + "\n\nTapestry added in!");
          console.log(response);
          for (let i = 0; i < payload.items.length; i++) {
            setMessage(
              `Sending data for item ${i + 1}: ${JSON.stringify(
                payload.items[i]
              )}`
            );
            // console.log(payload.items[i]);
            await fetch("/.netlify/functions/googlesheets", {
              method: "POST",
              body: JSON.stringify({ item: payload.items[i] }),
            })
              .then((res) => res.json())
              .then((response) => {
                setMessage(message + "\nItem added in!");
                console.log(response);
              })
              .catch((error) => {
                setMessage("Error adding item!");
                console.error("Error adding item: ", error);
              });
          }
        })
        .then(() => {
          // This is firing too soon!
          setMessage(
            `Tapestry uploaded correctly. Rebuilding site – go <a href="/">here</a> in about thirty seconds.`
          );
          fireWebhook(buildhook);
        })
        .catch((error) => {
          setMessage("Error adding tapestry!");
          console.error(error);
        });
    } else {
      console.log("Modifying existing tapestry: ", existingTapestry);
      const getGoogleIdForId = (id) =>
        segments.find((segment) => segment.id === id).googleId || id;
      // row.id === existingTapestry.googleId || row.id; // does this need to be done?
      const payload = {
        tapestry: row,
        items: segments.map((segment) => {
          const { content, height, hideTitle, title, type, url, width, x, y } =
            segment;
          return {
            content: content,
            height: height,
            hideTitle: hideTitle,
            title: title,
            type: type,
            x: x,
            y: y,
            width: width,
            url: url,
            tapestryId: row.slug,
            linksTo: segment.linksTo.map((x) => getGoogleIdForId(x)).join(","),
            id: segment.googleId || segment.id,
            controlList: JSON.stringify(segment.controlList), //TODO: fix this
          };
        }),
      };
      console.log("Payload: ", payload);
      // TODO: make new function to send in modified data, add in new data
      await fetch(`/.netlify/functions/googlesheets/${row.id}`, {
        method: "PUT",
        body: JSON.stringify({ tapestry: payload.tapestry }),
      })
        .then((res) => res.json())
        .then(async (response) => {
          setMessage(message + "\n\nTapestry modified!");
          console.log(response);
          for (let i = 0; i < payload.items.length; i++) {
            setMessage(
              `Sending data for item ${i + 1}: ${JSON.stringify(
                payload.items[i]
              )}`
            );
            // console.log(payload.items[i]);
            await fetch(
              `/.netlify/functions/googlesheets/${payload.items[i].id}`,
              {
                method: "PUT",
                body: JSON.stringify({ item: payload.items[i] }),
              }
            )
              .then((res) => res.json())
              .then((response) => {
                setMessage(message + "\nItem edited!");
                console.log(response);
              })
              .catch((error) => {
                setMessage("Error editing item!");
                console.error("Error editing item: ", error);
              });
          }
        })
        .then(() => {
          // This is firing too soon!
          setMessage(
            `Tapestry modified correctly. Rebuilding site – go <a href="/">here</a> in about thirty seconds.`
          );
          fireWebhook(buildhook);
        })
        .catch((error) => {
          setMessage("Error adding tapestry!");
          console.error(error);
        });
    }
  };

  const addSegment = (e) => {
    e.preventDefault();
    const defaultTitle = "Item " + (segments.length + 1);
    const thisItem = {
      id: uuidv4(4),
      title: defaultTitle,
      slug: slugify(defaultTitle),
      x: segments.length + 1,
    };
    setFocusedItem(thisItem);
    setSegments([...segments, thisItem]);
  };

  return (
    <div className="makerpage">
      <h3>
        <Link to={"/"}>← Home</Link>
      </h3>
      <h1>Tapestry Maker</h1>
      <form onSubmit={handleTapestrySubmit}>
        <p>
          Choose a tapestry to edit:{" "}
          <select
            style={{ display: "inline-block" }}
            onChange={(e) => handleSetTapestry(e.target.value)}
          >
            <option value={0}>Create a new tapestry</option>
            {tapestries.map((tapestry, index) => (
              <option key={index} value={tapestry.id}>
                {tapestry.title}
              </option>
            ))}
          </select>{" "}
          or,{" "}
          <input
            style={{ display: "inline-block", padding: "10px" }}
            type="button"
            value="add a new tapestry"
            onClick={() => {
              handleSetTapestry(0);
            }}
          />
          .
        </p>
        <div>
          {isNewTapestry ? (
            <h1>Add new tapestry</h1>
          ) : (
            <h1>
              Editing <strong>{title}</strong>
            </h1>
          )}
          <div>
            <h2>Tapestry details</h2>
            <p className="twoinputs">
              <label>
                Title:{" "}
                <input
                  type="text"
                  name={"title"}
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    setSlug(slugify(e.target.value));
                  }}
                />
              </label>
              <label>
                Slug:{" "}
                <input
                  type="text"
                  name={"slug"}
                  value={slug}
                  onChange={(e) => setSlug(slugify(e.target.value))}
                />
              </label>
            </p>
            <p className="twoinputs">
              <label>
                Author:{" "}
                <input
                  type="text"
                  name={"author"}
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </label>
              <label>
                Background:{" "}
                <input
                  placeholder="a CSS background value"
                  type="text"
                  name={"background"}
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                />
                <input
                  type="color"
                  name={"backgroundColor"}
                  onChange={(e) => {
                    setBackground(e.target.value);
                  }}
                />
              </label>
            </p>
            <p className="twoinputs">
              <label>
                Grid unit size:
                <input
                  type="number"
                  name={"gridUnitSize"}
                  value={gridUnitSize}
                  onChange={(e) =>
                    setGridUnitSize(parseInt(e.target.value, 10) || 0)
                  }
                />
              </label>
              <label>
                Grid gap:
                <input
                  type="number"
                  name={"gridGap"}
                  value={gridGap}
                  onChange={(e) =>
                    setGridGap(parseInt(e.target.value, 10) || 0)
                  }
                />
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={initialView}
                  onChange={(e) => setInitialView(e.target.checked)}
                />
                Set initial viewport?
              </label>
            </p>
            {initialView ? (
              <p className="twoinputs">
                <label>
                  Initial X offset:
                  <input
                    type="number"
                    name={"initialX"}
                    value={initialX}
                    onChange={(e) =>
                      setInitialX(parseInt(e.target.value, 10) || 0)
                    }
                  />
                </label>
                <label>
                  Initial Y offset:
                  <input
                    type="number"
                    name={"initialY"}
                    value={initialY}
                    onChange={(e) =>
                      setInitialY(parseInt(e.target.value, 10) || 0)
                    }
                  />
                </label>
                <label>
                  Default zoom:
                  <input
                    type="number"
                    name={"defaultZoom"}
                    value={defaultZoom}
                    onChange={(e) => setDefaultZoom(parseFloat(e.target.value))}
                  />
                </label>
              </p>
            ) : null}
            <DemoGrid
              key={`flag_${flag}`}
              items={segments}
              focused={focusedItem}
              gridGap={gridGap}
              gridUnitSize={gridUnitSize}
              background={background}
            />
            <hr style={{ marginTop: "2em" }} />
            <div>
              <h2>Items</h2>
              {segments.length ? (
                segments.map((segment, index) => (
                  <AddTapestryItem
                    color={getColor(index)}
                    key={segment.id}
                    gridUnitSize={gridUnitSize}
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
              <button style={{ marginTop: "20px" }} onClick={addSegment}>
                Add new item
              </button>
              <button
                style={{ marginTop: "20px" }}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Adding multiple items mode!");
                  setAddItems(uuidv4());
                }}
              >
                Add multiple items
              </button>
              <button
                style={{ marginTop: "20px" }}
                onClick={(e) => {
                  e.preventDefault();
                  console.log("Add collection mode!");
                  setAddCollection(uuidv4());
                }}
              >
                Add IA collection
              </button>
            </div>
            {addCollection ? (
              <AddCollection
                setAddCollection={setAddCollection}
                segments={segments}
                setSegments={setSegments}
                id={addItems}
              />
            ) : null}
            {addItems ? (
              <AddItems
                setAddItems={setAddItems}
                segments={segments}
                setSegments={setSegments}
                id={addCollection}
              />
            ) : null}
            <hr style={{ marginTop: "2em" }} />
            {message ? (
              <p
                style={{ marginBottom: "1em" }}
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ) : null}
            <input
              type="submit"
              value={`Publish ${
                isNewTapestry ? "" : "changes "
              }to Google Sheets`}
            />
            {isNewTapestry ? null : (
              <p style={{ display: "flex", alignItems: "baseline" }}>
                Or you can{" "}
                <input
                  style={{
                    display: "inline-block",
                    padding: "10px",
                    margin: "0 10px",
                  }}
                  type="button"
                  onClick={(e) => {
                    handleTapestrySubmit(e, true);
                  }}
                  value="Fork this tapestry"
                />{" "}
                which will create a new tapestry with the changed values.
              </p>
            )}
          </div>
        </div>
      </form>
      {segments.length ? (
        <div>
          <hr />
          <h2>Preview: </h2>

          <TapestryComponent
            tapestry={{
              id: "preview",
              gridUnitSize: gridUnitSize,
              background: background,
              gridGap: gridGap,
              items: segments,
              initialView: initialView,
              defaultZoom: defaultZoom,
              initialX: initialX,
              initialY: initialY,
            }}
            setTitle={() => {}}
          />
        </div>
      ) : null}
    </div>
  );
}
