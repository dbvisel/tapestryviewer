import { Link, useOutletContext, useLoaderData } from "remix";
import { cleanDate } from "~/utils/utils.mjs";

export const loader = () => {
  const buildhook = process.env.BUILD_HOOK;
  return { buildhook: buildhook };
};

const fireWebhook = (url) => {
  console.log("firing webhook:", url);
  fetch(url, {
    method: "POST",
  }).then((res) => console.log(res));
};

export default function MainIndex() {
  const { buildhook } = useLoaderData();
  const { tapestries } = useOutletContext();
  return (
    <div style={{ maxWidth: 800, marginLeft: "auto", marginRight: "auto" }}>
      <h1>Tapestries</h1>
      <p>This is a list of tapestries currently in the system.</p>
      <ul>
        {tapestries.map((tapestry) => (
          <li key={tapestry.slug}>
            <Link to={`/tapestry/${tapestry.slug}`}>
              {tapestry.title} ({cleanDate(tapestry.dateCreated)})
            </Link>
          </li>
        ))}
      </ul>
      <p>
        Model reference is{" "}
        <a href="https://docs.google.com/document/d/1uqnUIORi5lypQeS2-l9VQ3xkUNSP0gmmewaiID9GFPg/edit#">
          here
        </a>
        . The code can be looked at on{" "}
        <a href="https://github.com/dbvisel/tapestryviewer">Github</a>. A Google
        sheet with tapestry and item data is{" "}
        <a href="https://docs.google.com/spreadsheets/d/1EfdUXGmHdiJ5gcqZn4LdBJuXB0L6QZvKe3Vd7RP33SM/edit?usp=sharing">
          here
        </a>
        ; instructions are in Github. If you have added another tapestry in the
        Google sheet, click{" "}
        <a
          href={"/#"}
          onClick={(e) => {
            e.preventDefault();
            fireWebhook(buildhook);
          }}
        >
          here
        </a>{" "}
        to rebuild this site; this takes about a minute. Then reload this page.
      </p>
      <p>
        You can also try the <Link to="/maker">tapestry maker</Link>, though
        that's still buggy.
      </p>
    </div>
  );
}
