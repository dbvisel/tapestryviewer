import { useState } from "react";
import { Link, useLoaderData, useOutletContext } from "remix";
import { v4 as uuidv4 } from "uuid";
import { slugify, getColor } from "~/utils/utils.mjs";
import AddTapestryItem from "~/components/AddTapestryItem";
import DemoGrid from "~/components/DemoGrid";
import makerStyles from "~/styles/maker.css";
import tapestryStyles from "~/styles/tapestries.css";

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
  const [existingTapestry, setExistingTapestry] = useState(null);

  const handleSetTapestry = (id) => {
    setIsNewTapestry(!Boolean(id));
    if (id) {
      const tapestry = tapestries.find((tapestry) => tapestry.id === id);
      setExistingTapestry(tapestry);
      setTitle(tapestry.title);
      setSlug(tapestry.slug);
      setAuthor(tapestry.author);
      setBackground(tapestry.background);
      setGridUnitSize(tapestry.gridUnitSize);
      setGridGap(tapestry.gridGap);
      setSegments(tapestry.items);
    }
  };

  const handleTapestrySubmit = async (e) => {
    e.preventDefault();
    const row = {
      title: title || "New tapestry",
      slug: slugify(slug) || slugify(title) || uuidv4(),
      id: slugify(slug) || slugify(title),
      author: author || "Tapestry author",
      background: background,
      gridUnitSize: gridUnitSize,
      gridGap: gridGap,
    };
    const payload = {
      tapestry: row,
      items: segments.map((segment) => {
        return {
          ...segment,
          tapestryId: row.slug,
          linksTo: segment.linksTo.join(","), // TODO: this needs to change to an ID
          forkable: true,
        };
      }),
    };
    console.log(payload);
    if (isNewTapestry) {
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
            console.log(payload.items[i]);
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
      console.log("Modifying existing tapestry");
      console.log(existingTapestry);
      // TODO: mmerge old data with modified data.
      // TODO: make new function to send in modified data, add in new data
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
          {isNewTapestry ? <h1>Add new tapestry</h1> : <h1>Editing {title}</h1>}
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
                    setGridUnitSize(parseInt(e.target.value, 10))
                  }
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
            </div>
            <hr style={{ marginTop: "2em" }} />
            {message ? (
              <p
                style={{ marginBottom: "1em" }}
                dangerouslySetInnerHTML={{ __html: message }}
              />
            ) : null}
            <input type="submit" value="Publish to Google Sheets" />
            <p>
              PLEASE DO NOT PUBLISH IF YOU'RE EDITING AN EXISTING TAPESTRY! THIS
              WILL CREATE A NEW TAPESTRY WITH THE SAME NAME!
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
