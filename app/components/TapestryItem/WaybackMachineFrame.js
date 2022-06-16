import { useState, useEffect } from "react";
import { humanDate } from "~/utils/utils.mjs";
import throbber from "./images/Loading_icon_cropped.gif";

const WaybackMachineFrame = ({ title, url, hideTitle, titleClick }) => {
  const [dates, setDates] = useState([]);
  const [thisUrl, setUrl] = useState(url);
  const deslashed = url
    .split("/web.archive.org/web")[1]
    .split(/\/\d+\//)
    .join("");

  useEffect(() => {
    const getDates = async () => {
      // console.log("querying for dates!");
      // console.log(deslashed);
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
          console.log("Can't find dates.");
          console.error(e);
        });
    };
    getDates();
  }, [deslashed]);

  return (
    <div className={`${hideTitle ? "notitle" : ""} frame webframe`}>
      {hideTitle ? null : (
        <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
          {title}
        </h2>
      )}
      <div>
        <img src={throbber} alt={"Loading..."} />
      </div>
      <iframe
        title={title}
        src={thisUrl}
        frameBorder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen
        loading="lazy"
      />
      {dates.length ? (
        <div className="waybackslider">
          <p>
            <label>
              <span style={{ whiteSpace: "nowrap" }}>Version to show: </span>
              <select
                value={url.split("web.archive.org/web/")[1].split("/")[0]}
                onMouseDown={(e) => {
                  e.stopPropagation();
                }}
                onChange={(e) => {
                  const theRest = url.replace(/\/\d+\//, `/${e.target.value}/`);
                  // console.log(theRest);
                  setUrl(theRest);
                }}
              >
                {dates.map((date, index) => (
                  <option value={date} key={`${date}_${index}`}>
                    {humanDate(date)}
                  </option>
                ))}
              </select>
            </label>
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default WaybackMachineFrame;
