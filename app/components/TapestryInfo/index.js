import { useEffect, useState } from "react";
import { Link } from "remix";
import { cleanDate } from "~/utils/utils.mjs";

const TapestryInfo = ({
  tapestry,
  forkHistory,
  forkedFromThis,
  version,
  setVersion,
}) => {
  const [currentVersion, setCurrentVersion] = useState(version);
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
        <ul style={{ listStyleType: "none" }}>
          {tapestry.history.length ? (
            tapestry.history.map((history, index) => (
              <label key={index}>
                <input
                  type="radio"
                  value={index}
                  checked={currentVersion === index}
                  onChange={() => {
                    setCurrentVersion(index);
                    setVersion(tapestry.history[index]);
                  }}
                />
                <b>{cleanDate(history.dateUpdated)}:</b>
                <p>{JSON.stringify(history)}</p>
              </label>
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
        </ul>
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
