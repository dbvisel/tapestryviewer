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
      <div>
        <h2>Raw data</h2>
        {JSON.stringify(tapestry)}
      </div>
      <div>
        <h2>Items</h2>
        {tapestry.items.length ? (
          <ul>
            {tapestry.items.map((item, index) => (
              <li key={index}>{JSON.stringify(item)}</li>
            ))}
          </ul>
        ) : (
          <p>No items!</p>
        )}
      </div>
      <div>
        <h2>Tapestry history</h2>
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
      </div>
      <div>
        <h2>Fork history</h2>
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
      </div>
      <div>
        <h2>Tapestries forked from this one:</h2>
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
      </div>{" "}
    </div>
  );
}
