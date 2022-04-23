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

function inIframe() {
  try {
    return window.self !== window.top;
  } catch (e) {
    return true;
  }
}

const TapestryNav = ({ filteredTapesties }) => {
  const [navShown, setNavShown] = useState(false);
  return (
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
          {filteredTapestries.map((tapestry) => (
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
  );
};

export default function TapestryOverview() {
  const { tapestries } = useOutletContext();
  const filteredTapestries = tapestries.filter((x) => !x.hideOnFront);
  const isIframe = inIframe();
  return (
    <div className="tapestrypage">
      {isIframe ? null : (
        <TapestryNav filteredTapestries={filteredTapestries} />
      )}
      <main className={isIframe ? "iframe" : ""}>
        <Outlet context={{ isIframe: isIframe }} />
      </main>
    </div>
  );
}
