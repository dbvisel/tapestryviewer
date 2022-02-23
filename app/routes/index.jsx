import { Link, useLoaderData } from "remix";
import { getTapestries } from "~/tapestry";
import { cleanDate } from "~/utils/utils";

export const loader = async () => {
  return getTapestries();
};

export default function MainIndex() {
  const tapestries = useLoaderData();
  return (
    <div>
      <h1>Tapestries</h1>
      <p>This is a list of tapestries currently in the system.</p>
      <ul>
        {tapestries.map((tapestry) => (
          <li key={tapestry.slug}>
            <Link to={`/tapestries/${tapestry.slug}`}>
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
        .
      </p>
      <p>
        If you have added another tapestry in the Google sheet, click here to
        rebuild this site.
      </p>
    </div>
  );
}
