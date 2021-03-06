import { useState } from "react";
import { Link } from "remix";
import { diffJson } from "diff";
import { cleanDate } from "~/utils/utils.mjs";

const TapestryInfo = ({
  tapestry,
  forkHistory,
  forkedFromThis,
  version,
  setVersion,
}) => {
  const [currentVersion, setCurrentVersion] = useState(version);
  for (let i = 0; i < tapestry.history.length; i++) {
    console.log(
      diffJson(
        i > 0 ? tapestry.history[i - 1] : {},
        tapestry.history[i]
      ).filter((x) => x.added)[0].value
    );
  }
  return (
    <div>
      <details>
        <summary>Raw data</summary>
        {JSON.stringify(tapestry)}
      </details>
      <details>
        <summary>
          Items {tapestry.items.length ? `(${tapestry.items.length})` : ""}
        </summary>
        {tapestry.items.length ? (
          <ul>
            {tapestry.items.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        ) : (
          <p>No items!</p>
        )}
      </details>
      <details>
        <summary>
          Tapestry history{" "}
          {tapestry.history.length ? `(${tapestry.history.length})` : ""}
        </summary>
        <div>
          {tapestry.history.length ? (
            tapestry.history.map((thisHistory, index) => (
              <details key={index}>
                <summary>
                  Added on {cleanDate(thisHistory.dateUpdated)} (version{" "}
                  {index + 1}):
                </summary>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label style={{ flex: 1 }}>
                    <input
                      type="radio"
                      value={index}
                      checked={currentVersion === index}
                      onChange={() => {
                        setCurrentVersion(index);
                        setVersion(tapestry.history[index]);
                      }}
                    />
                    Switch to this version
                  </label>
                  <pre
                    style={{ flex: 1 }}
                    dangerouslySetInnerHTML={{
                      __html: diffJson(
                        index > 0 ? tapestry.history[index - 1] : {},
                        thisHistory
                      ).filter((x) => x.added)[0].value,
                    }}
                  />
                </div>
              </details>
            ))
          ) : (
            <p>No tapestry history!</p>
          )}
          <label>
            <input
              type="radio"
              value={-1}
              checked={currentVersion === -1}
              onChange={() => {
                setCurrentVersion(-1);
                setVersion(tapestry);
              }}
            />
            Current version
          </label>
        </div>
      </details>
      <details>
        <summary>
          Fork history {forkHistory.length ? `(${forkHistory.length})` : ""}
        </summary>
        {forkHistory.length ? (
          <ul>
            {forkHistory.map((history, index) => (
              <li key={index}>
                Forked from{" "}
                <Link to={`/tapestry/${history.slug}`}>{history.title}</Link> at{" "}
                {cleanDate(history.dateUpdated)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No fork history!</p>
        )}
      </details>
      <details>
        <summary>
          Tapestries forked from this one{" "}
          {forkedFromThis.length ? `(${forkedFromThis.length})` : ""}
        </summary>
        {forkedFromThis.length ? (
          <ul>
            {forkedFromThis.map((history, index) => (
              <li key={index}>
                Forked as{" "}
                <Link to={`/tapestry/${history.slug}`}>{history.title}</Link> at{" "}
                {cleanDate(history.dateUpdated)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No fork history!</p>
        )}
      </details>{" "}
    </div>
  );
};

export default TapestryInfo;
