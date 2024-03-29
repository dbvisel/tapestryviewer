import { useState, useEffect, Fragment } from "react";
import { MegadraftEditor, editorStateFromRaw, DraftJS } from "megadraft";
import { convertFromHTML, convertToHTML } from "draft-convert";
import TapestryItem from "~/components/TapestryItem";
import { getColor, secondsToTime, humanDate } from "~/utils/utils.mjs";
import {
  getPage,
  getMode,
  getBaseUrl,
  composeUrl,
  getDownloadUrl,
} from "~/utils/iaUtils";

const AddItem = ({
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
  const [thumbnail, setThumbnail] = useState(itemData.thumbnail || "");
  const [dates, setDates] = useState([]);
  const [maxPageCount, setMaxPageCount] = useState(0);
  const [startPoint, setStartPoint] = useState(0);
  const [maxLength, setMaxLength] = useState(0);
  const [useImage, setUseImage] = useState(false);
  const [directAudioUrl, setDirectAudioUrl] = useState(
    itemData.type === "audiocontroller" ? itemData.thumbnail : ""
  );
  const [useAudioController, setUseAudioController] = useState(
    itemData.type === "audiocontroller"
  );
  const [controlList, setControlList] = useState(
    itemData.type === "audiocontroller"
      ? itemData.controlList
      : [{ id: "", time: 0 }]
  );

  const [editorState, setEditorState] = useState(() =>
    content === null
      ? editorStateFromRaw(content)
      : DraftJS.EditorState.createWithContent(convertFromHTML(content))
  );

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
      thumbnail: thumbnail,
      controlList:
        JSON.stringify(controlList) === `[{"id":"","time":0}]`
          ? []
          : controlList,
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
    thumbnail,
    controlList, // itemData, setItemData
  ]);

  useEffect(() => {
    const checkIaResource = async () => {
      if (type === "iaresource" && url) {
        // We could be doing this for any website? pulling in the closest Wayback Machine URL?
        if (
          url.includes("https://archive.org/") ||
          url.includes("http://archive.org/") ||
          url.includes("https://www.archive.org/") ||
          url.includes("http://www.archive.org")
        ) {
          console.log("in this loop");
          const newUrl = url
            .replace("archive.org/details/", "archive.org/embed/")
            .replace("archive.org/stream/", "archive.org/embed/")
            .replace("http://", "https://")
            .replace("www.archive.org", "archive.org");
          const splitUrl = newUrl.split("/embed/");
          const metadataUrl =
            splitUrl[0] + "/metadata/" + splitUrl[1].split("/")[0];
          setMessage("Querying Internet Archive . . .");
          // console.log(newUrl, metadataUrl);
          setUrl(newUrl);
          // TODO: This is probably not working in production!
          await fetch(metadataUrl, {
            method: "GET",
          })
            .then((res) => res.json())
            .then(async (r) => {
              console.log(r);
              console.log(r.files.filter((x) => !x.private));
              if (r.metadata.title) {
                setTitle(r.metadata.title);
              }
              if (r.metadata.mediatype === "audio") {
                const mp3List = r.files.filter(
                  (x) => x.name.indexOf(".mp3") > -1
                );
                if (mp3List.length) {
                  const firstMp3 = mp3List[0];
                  setDirectAudioUrl(`https://${r.d1}${r.dir}/${firstMp3.name}`);
                  setThumbnail(`https://${r.d1}${r.dir}/${firstMp3.name}`);
                }
                setType("audio");
              }
              if (r.metadata.mediatype === "movies") {
                // const captionFile = r.files.filter(
                //   (x) => x.format === "Closed Caption Text" && !x.private
                // );
                // // TODO: this doesn't work because of CORS!
                // if (captionFile.length) {
                //   // TODO: fetch caption file
                //   console.log(
                //     `Fetching https://${r.d1}${r.dir}/${captionFile[0].name}`
                //   );
                //   await fetch(`https://${r.d1}${r.dir}/${captionFile[0].name}`, {
                //     method: "GET",
                //     mode: "cors",
                //   })
                //     .then(async (r) => {
                //       console.log(r);
                //       setContent(r);
                //     })
                //     .catch((e) => {
                //       setMessage("There was an error, check the log");
                //       console.error(e);
                //     });
                // }

                // Could take this as a thumbnail (does this always work?):
                // though to do this we would need to make sure this works for everything.
                // and we would need to have a "thumbnail" as part of the itemData.

                const thumbnail = `https://${r.d1}${r.dir}/${r.files[0].name}`;
                // (this is wrong for tv archive)
                setThumbnail(thumbnail);
                console.log("Possible thumbnail: ", thumbnail);
                // this fails for TV archive clips.
                setMaxLength(r.files[1]?.length || 0);
                console.log("Possible maxLength: ", maxLength);
                setType("video");
              }
              if (r.metadata.mediatype === "texts") {
                const pageCount = parseInt(r.metadata.imagecount, 10);
                setMaxPageCount(pageCount);
                const thumbnail = `https://${r.d1}${r.dir}/${r.files[0].name}`;
                setThumbnail(thumbnail);
                const page = getPage(newUrl);
                const mode = getMode(newUrl);
                console.log(thumbnail, page, pageCount, mode);

                // in URL, there's /page/n1/mode/1up

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
        } else {
          console.log("this is not archive.org media");
          if (url.includes("https://web.archive.org/web")) {
            const siteToSearch = url.split("/web.archive.org/web")[1];
            if (siteToSearch) {
              const deslashed = siteToSearch.split(/\/\d+\//).join(""); //.split("/").filter(Boolean).join("/"); // this removes trailing slashes
              // console.log(deslashed);
              if (deslashed) {
                // const theUrl = `http://web.archive.org/web/timemap/json/${deslashed}`;
                // const theUrl = `http://archive.org/wayback/available?url=${deslashed}`;
                // console.log(theUrl);
                setMessage("Querying Internet Archive . . .");
                await fetch(`/.netlify/functions/memento`, {
                  method: "POST",
                  body: JSON.stringify({ url: deslashed }),
                })
                  .then((res) => res.json())
                  .then(async (r) => {
                    // r is an array of dates
                    // console.log(r);
                    setDates(r);
                    // console.log(r);
                  })
                  .catch((e) => {
                    console.error(e);
                  });

                setType("waybackmachine"); // this could be a special type?
              } else {
                console.error("Weird Wayback Machine URL: ", url);
                setType("web");
                // if we get here, there's something off about the URL
                return;
              }
            } else {
              console.error("Weird Wayback Machine URL: ", url);
              setType("web");
              // if we get here, there's something off about the URL
              return;
            }
          } else {
            if (url.indexOf("web.archive.org") < 0) {
              console.log(`this is not a wayback machine url: ${url}`);
              console.log("Querying the Wayback Machine . . .");
              const urlReplaced = url
                .replace("https://", "")
                .replace("http://", "");
              await fetch(`/.netlify/functions/checkwayback`, {
                method: "POST",
                body: JSON.stringify({ url: urlReplaced }),
              })
                .then((res) => res.json())
                .then(async (r) => {
                  if (r.indexOf("web.archive.org") > -1) {
                    console.log("repsonse!", r);
                    setUrl(r);
                    setType("waybackmachine");
                    setMessage(
                      "This is on the Internet Archive. Querying Internet Archive . . ."
                    );
                    await fetch(`/.netlify/functions/memento`, {
                      method: "POST",
                      body: JSON.stringify({ url: urlReplaced }),
                    })
                      .then((res) => res.json())
                      .then(async (r) => {
                        // r is an array of dates
                        setDates(r);
                        // console.log(r);
                      })
                      .catch((e) => {
                        console.error("Error fetching dates: ", e);
                      });
                  } else {
                    console.log("No Wayback Machine URL found.");
                    setType("web");
                  }
                })
                .catch((e) => {
                  console.error("Error querying Wayback Machine: ", e);
                  console.log("URL: ", urlReplaced);
                });
            }
          }
        }
      } else {
        setMessage("");
      }
    };

    if (type === "iaresource" && url) {
      checkIaResource();
    }
  }, [type, url, maxLength]);

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
        id={`maker-${itemData.id}`}
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
              <option value="tapestrylink">Tapestry link</option>
              <option value="tapestry">Embedded tapestry</option>
              <option value="iaresource">IA resource</option>
              <option value="book">Book</option>
              <option value="video">Video</option>
              <option value="image">Image</option>
              <option value="audio">Audio</option>
              <option value="web">Web page</option>
              <option value="waybackmachine" hidden>
                Wayback Machine page
              </option>
              <option value="software">Software</option>
              <option value="bookimage" hidden>
                Book image
              </option>
              <option value="audiocontroller" hidden>
                Audio controller
              </option>
            </select>
          </label>
        </p>
        {type === "tapestry" ? (
          <p className="twoinputs">
            <label>
              <input
                type="checkbox"
                checked={url.indexOf("?nocomments") > -1}
                onChange={(e) => {
                  setUrl(
                    e.target.checked
                      ? url + "?nocomments"
                      : url.replace("?nocomments", "")
                  );
                }}
              />
              Hide the comments drawer in the embedded tapestry?
            </label>
          </p>
        ) : null}
        {type === "textFrame" ? (
          <div className="twoinputs">
            <div
              style={{
                margin: "20px 0 20px 80px",
                width: "100%",
                background: "white",
                borderRadius: "4px",
              }}
            >
              <MegadraftEditor
                editorState={editorState}
                onChange={(e) => {
                  setEditorState(e);
                  setContent(convertToHTML(editorState.getCurrentContent()));
                }}
                placeholder="Add some text"
              />
            </div>
          </div>
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
                    type === "tapestry" || type === "tapestrylink"
                      ? "Set this to the slug of a defined tapestry"
                      : ""
                  }
                />
              </label>
            </p>
            {maxLength ? (
              <p style={{ display: "flex", alignItems: "center" }}>
                <span style={{ whiteSpace: "nowrap" }}>Set start point: </span>
                <label>
                  <input
                    type="range"
                    id="startPoint"
                    name="startPoint"
                    min="0"
                    value={startPoint}
                    max={maxLength}
                    onChange={(e) => {
                      const newUrl =
                        url.replace(/\?start=[0-9]+/, "") +
                        `?start=${e.target.value}`;
                      setUrl(newUrl);
                      setStartPoint(e.target.value);
                    }}
                  />
                  <span>
                    {" "}
                    {secondsToTime(startPoint)}/{secondsToTime(maxLength)}
                  </span>
                </label>
              </p>
            ) : null}
            {(type === "audio" || type === "audiocontroller") &&
            directAudioUrl ? (
              <div>
                <div className="twoinputs">
                  <label>
                    <input
                      type="checkbox"
                      checked={useAudioController}
                      onChange={(e) => {
                        setUseAudioController(e.target.checked);
                        // if (e.target.checked) {
                        //   console.log("checked!");
                        // }

                        setType(e.target.checked ? "audiocontroller" : "audio");
                      }}
                    />
                    Use audio to control playback
                  </label>
                </div>
                {useAudioController ? (
                  <div>
                    {controlList.map((controlPoint, index) => (
                      <div className="twoinputs" key={index}>
                        <label style={{ flex: 2 }}>
                          Focus on:
                          <select
                            value={controlList[index].id}
                            onChange={(e) => {
                              const newControlList = [...controlList];
                              newControlList[index].id = e.target.value;
                              setControlList(newControlList);
                            }}
                          >
                            <option value={""}>None</option>
                            {items
                              .filter((x) => x.id !== itemData.id)
                              .map((item, index) => (
                                <option
                                  key={index}
                                  value={item.googleId || item.id}
                                  className="linkselector"
                                  style={{
                                    "--color": getColor(
                                      items.map((x) => x.id).indexOf(item.id)
                                    ),
                                  }}
                                  data-index={
                                    items.map((x) => x.id).indexOf(item.id) + 1
                                  }
                                >
                                  {item.title}
                                </option>
                              ))}
                          </select>
                        </label>
                        <label>
                          at time
                          <input
                            type="text"
                            value={controlList[index].time}
                            onChange={(e) => {
                              const newControlList = [...controlList];
                              newControlList[index].time = parseInt(
                                e.target.value,
                                10
                              );
                              setControlList(newControlList);
                            }}
                          />{" "}
                          (ms)
                        </label>
                      </div>
                    ))}
                    <input
                      type="button"
                      value="Add new stop"
                      onClick={() => {
                        setControlList(
                          controlList.concat([{ id: "", time: 0 }])
                        );
                      }}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            {dates.length ? (
              <p>
                <label>
                  <span style={{ whiteSpace: "nowrap" }}>
                    Version to show:{" "}
                  </span>
                  <select
                    value={url.split("web.archive.org/web/")[1].split("/")[0]}
                    onChange={(e) => {
                      const theRest = url.replace(
                        /\/\d+\//,
                        `/${e.target.value}/`
                      );
                      // console.log(theRest);
                      setUrl(theRest);
                    }}
                  >
                    {dates.map((date, i) => (
                      <option value={date} key={`${date}_${i}`}>
                        {humanDate(date)}
                      </option>
                    ))}
                  </select>
                </label>
              </p>
            ) : null}
            {type === "book" || type === "bookimage" ? (
              <p className="twoinputs">
                {type === "book" ? (
                  <label style={{ whiteSpace: "nowrap" }}>
                    Display style:{" "}
                    <select
                      value={getMode(url)}
                      onChange={(e) => {
                        const baseUrl = getBaseUrl(url);
                        const currentPage = getPage(url);
                        setUrl(
                          composeUrl(baseUrl, currentPage, e.target.value)
                        );
                      }}
                    >
                      <option value="1up">Single page</option>
                      <option value="2up">Facing pages</option>
                    </select>
                  </label>
                ) : null}
                <label style={{ whiteSpace: "nowrap" }}>
                  Start on page:{" "}
                  <input
                    placeholder={`1-${maxPageCount}`}
                    type="numeric"
                    value={getPage(url)}
                    onChange={(e) => {
                      const val = Math.min(
                        maxPageCount,
                        parseInt(e.target.value, 10)
                      );
                      const baseUrl = getBaseUrl(url);
                      const currentMode = getMode(url);
                      if (type === "bookimage") {
                        setThumbnail(getDownloadUrl(baseUrl, val));
                      }
                      setUrl(composeUrl(baseUrl, val, currentMode));
                    }}
                  />
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={useImage}
                    onChange={(e) => {
                      setUseImage(e.target.checked);
                      if (e.target.checked) {
                        setThumbnail(getDownloadUrl(url, getPage(url)));
                      }

                      setType(e.target.checked ? "bookimage" : "book");
                    }}
                  />
                  Use image
                </label>
              </p>
            ) : null}
            {message ? <p>{message}</p> : null}
          </Fragment>
        )}
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
              x:
              <input
                type="number"
                value={x}
                onChange={(e) => setX(parseInt(e.target.value, 10) || 0)}
              />
            </label>
            <label style={{ marginLeft: 0 }}>
              y:
              <input
                type="number"
                value={y}
                onChange={(e) => setY(parseInt(e.target.value, 10) || 0)}
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
                onChange={(e) => setWidth(parseInt(e.target.value, 10) || 0)}
              />
            </label>{" "}
            <label style={{ marginLeft: 0 }}>
              Height:{" "}
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(parseInt(e.target.value, 10) || 0)}
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
        </div>
        <hr style={{ width: "50%", marginLeft: "25%" }} />
      </div>
      <div
        className="previewcontainer"
        style={{
          gridTemplateColumns: `${width * gridUnitSize}px`,
          gridTemplateRows: `${height * gridUnitSize}px`,
        }}
      >
        <TapestryItem item={itemData} isPreviewItem />
        <input
          type="button"
          value="←"
          className="left"
          onClick={() => {
            if (x > 1) {
              setX(x - 1);
            }
          }}
        />
        <input
          type="button"
          value="→"
          className="right"
          onClick={() => {
            setX(x + 1);
          }}
        />
        <input
          type="button"
          value="+"
          className="xplus"
          onClick={() => {
            setWidth(width + 1);
          }}
        />
        <input
          type="button"
          value="–"
          className="xminus"
          onClick={() => {
            if (width > 1) {
              setWidth(width - 1);
            }
          }}
        />
        <input
          type="button"
          value="↑"
          className="up"
          onClick={() => {
            if (y > 1) {
              setY(y - 1);
            }
          }}
        />
        <input
          type="button"
          value="↓"
          className="down"
          onClick={() => {
            setY(y + 1);
          }}
        />
        <input
          type="button"
          value="+"
          className="yplus"
          onClick={() => {
            setHeight(height + 1);
          }}
        />
        <input
          type="button"
          value="–"
          className="yminus"
          onClick={() => {
            if (height > 1) {
              setHeight(height - 1);
            }
          }}
        />
      </div>
    </div>
  );
};

export default AddItem;
