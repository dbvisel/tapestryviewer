import { useLoaderData, Link } from "remix";
import invariant from "tiny-invariant";
import { getTapestries, getTapestryFromSlug } from "~/tapestry";
import {
  getTapestriesForkedFromThisOne,
  getTapestryForkHistory,
} from "~/models/tapestry";
import { cleanDate } from "~/utils/utils";

export const loader = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  const tapestries = await getTapestries();
  const tapestry = await getTapestryFromSlug(params.slug);
  const forkHistory = await getTapestryForkHistory(tapestries, tapestry);
  const forkedFromThis = await getTapestriesForkedFromThisOne(
    tapestries,
    tapestry
  );
  return {
    tapestry: tapestry,
    forkHistory: forkHistory,
    forkedFromThis: forkedFromThis,
  };
};

export default function PostSlug() {
  const { tapestry, forkHistory, forkedFromThis } = useLoaderData();
  return (
    <div>
      <h1>{tapestry.title}</h1>
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
        {tapestry.history.length ? (
          <ul>
            {tapestry.history.reverse().map((history, index) => (
              <li key={index}>
                <b>{cleanDate(history.dateUpdated)}:</b>
                <p>{JSON.stringify(history)}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tapestry history!</p>
        )}
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
                <Link to={`/tapestries/${history.slug}`}>{history.title}</Link>{" "}
                at {cleanDate(history.dateUpdated)}
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
                <Link to={`/tapestries/${history.slug}`}>{history.title}</Link>{" "}
                at {cleanDate(history.dateUpdated)}
              </li>
            ))}
          </ul>
        ) : (
          <p>No fork history!</p>
        )}
      </details>{" "}
    </div>
  );
}
