import { useState } from "react";
import { Outlet, Link, useOutletContext } from "remix";

import tapestryStyles from "~/styles/tapestries.css";
import navStyles from "~/styles/tapestrynav.css";

export const links = () => {
  return [
    { rel: "stylesheet", href: navStyles },
    { rel: "stylesheet", href: tapestryStyles },
  ];
};

export default function TapestryOverview() {
  const { tapestries } = useOutletContext();
  const [navShown, setNavShown] = useState(false);
  return (
    <div className="tapestrypage">
      <nav
        className="tapestrynav"
        style={{ transform: `translateX(${navShown ? 0 : -100}%)` }}
      >
        <h2
          onClick={() => {
            setNavShown(!navShown);
          }}
        >
          Tapestry selector
        </h2>
        <div>
          <h2>Tapestries</h2>
          <ul>
            {tapestries.map((tapestry) => (
              <li key={tapestry.slug}>
                → <Link to={`${tapestry.slug}`}>{tapestry.title}</Link>
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
