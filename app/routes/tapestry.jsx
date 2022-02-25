import { Outlet, Link, useOutletContext } from "remix";
import { cleanDate } from "~/utils/utils.mjs";

import tapestryStyles from "~/styles/tapestries.css";

export const links = () => {
  return [{ rel: "stylesheet", href: tapestryStyles }];
};

export default function TapestryOverview() {
  const { tapestries } = useOutletContext();
  return (
    <div className="tapestrypage">
      <nav>
        <div>
          <h2>Tapestries</h2>
          <ul>
            {tapestries.map((tapestry) => (
              <li key={tapestry.slug}>
                →{" "}
                <Link to={`${tapestry.slug}`}>
                  {tapestry.title} ({cleanDate(tapestry.dateCreated)})
                </Link>
              </li>
            ))}
          </ul>
          <h5>
            <Link to={"/"}>← Home</Link>
          </h5>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
