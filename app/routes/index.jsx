import { Link, useOutletContext } from "remix";
import { cleanDate } from "~/utils/utils.mjs";

export default function MainIndex() {
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
        , though that data is only pulled in manually at the moment.
      </p>
      {/*<p>
        If you have added another tapestry in the Google sheet, click here to
			rebuild this site.
      </p>*/}
    </div>
  );
}
