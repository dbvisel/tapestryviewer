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
  }).then((res) => {
    console.log(res);
    window.location.reload();
  });
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
        You can also try the <Link to="/maker">tapestry maker</Link>, which
        should let you edit any of the above tapestries.
      </p>
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
        ; instructions are in Github.
      </p>
      <p>
        If you have added another tapestry there or in the Google sheet, click{" "}
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
        The Netlify badge below should be green. If it's not, wait a few seconds
        and reload again.
      </p>
      <p>
        <img
          src="https://api.netlify.com/api/v1/badges/f9f28c0d-047c-4aa1-876d-aa47bb816f5f/deploy-status"
          alt="Netlify Status"
        />
      </p>
    </div>
  );
}
