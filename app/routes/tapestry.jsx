import React, { useState } from "react";
import { Outlet, Link, useOutletContext } from "remix";
import tapestryStyles from "~/styles/tapestries.css";
import navStyles from "~/styles/tapestrynav.css";

export const links = () => {
  return [
    { rel: "stylesheet", href: navStyles },
    { rel: "stylesheet", href: tapestryStyles },
  ];
};

const inIframe = () => {
  try {
    return window.self !== window.top;
  } catch (e) {
    console.log("this is an iframe");
    return true;
  }
};

const TapestryNav = ({ filteredTapestries }) => {
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
  const [isIframe, setIsIframe] = React.useState(false);
  const { tapestries } = useOutletContext();
  const filteredTapestries = tapestries.filter((x) => !x.hideOnFront);

  React.useEffect(() => {
    setIsIframe(inIframe());
  });

  return isIframe ? (
    <div className="tapestrypage">
      <main className="iframe">
        <Outlet context={{ isIframe: true }} />
      </main>
    </div>
  ) : (
    <div className="tapestrypage">
      <TapestryNav filteredTapestries={filteredTapestries} />
      <main>
        <Outlet context={{ isIframe: false }} />
      </main>
    </div>
  );
}
