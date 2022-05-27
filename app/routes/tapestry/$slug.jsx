import { Fragment, useEffect, useState } from "react";
import { useCatch, useParams, useLoaderData, useOutletContext } from "remix";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import invariant from "tiny-invariant";
import { getTapestries, getTapestryFromSlug } from "~/tapestryData";
import {
  getTapestriesForkedFromThisOne,
  getTapestryForkHistory,
} from "~/models/tapestry.mjs";
import { publicationStatus } from "~/utils/utils.mjs";
import TapestryInfo from "~/components/TapestryInfo";
import TapestryComponent from "~/components/TapestryComponent";

export const loader = async ({ params, request }) => {
  invariant(params.slug, "expected params.slug");
  const url = new URL(request.url);
  const noComments = url.search.indexOf("nocomments") > -1; // this is not working for iframes
  const tapestries = await getTapestries();
  const tapestry = await getTapestryFromSlug(params.slug);

  if (tapestry) {
    const forkHistory = await getTapestryForkHistory(tapestries, tapestry);
    const forkedFromThis = await getTapestriesForkedFromThisOne(
      tapestries,
      tapestry
    );
    return {
      tapestry: tapestry,
      forkHistory: forkHistory,
      forkedFromThis: forkedFromThis,
      noComments: noComments,
    };
  } else {
    console.log("tapestry not found");
    throw new Response("Tapestry not found", {
      status: 404,
    });
  }
};

export const meta = (data) => {
  const tapestry = data?.data?.tapestry;
  if (tapestry) {
    return {
      title: `Tapestry Viewer: ${tapestry.title}`,
      description: `A sample tapestry by ${tapestry.author}`,
    };
  }
};

export function CatchBoundary() {
  const caught = useCatch();
  const params = useParams();
  console.error("Error: ", caught);
  return (
    <div>
      <h1>Tapestry not found</h1>
      <p>
        A tapestry with the slug “{params.slug}” could not be found in the
        system.
      </p>
    </div>
  );
}

export default function TapestryPage() {
  const { tapestry, forkHistory, forkedFromThis, noComments } = useLoaderData();
  const { isIframe } = useOutletContext();
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [version, setVersion] = useState(tapestry);
  const handle = useFullScreenHandle();

  const figureOutVersion = () => {
    for (let i = 0; i < tapestry.history.length; i++) {
      if (tapestry.history[i] === version) {
        return i;
      }
    }
    return -1;
  };

  useEffect(() => {
    // TODO: need to figure out a way to get out of full screen
    if (isFullScreen) {
      // console.log("isFullScreen set to true");
      handle.enter();
    } else {
      // console.log("isFullScreen set to false");
      handle.exit();
    }
  }, [isFullScreen]);

  useEffect(() => {
    // console.log("tapestry changed!", tapestry);
    setVersion(tapestry);
  }, [tapestry]);

  return (
    <Fragment>
      {isFullScreen ? null : (
        <h1 className={isIframe ? "iframe" : ""}>
          {isIframe ? (
            <Fragment>
              <a
                href={`https://tapestryviewer.netlify.app/tapestry/${tapestry.slug}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {tapestry.title}
              </a>{" "}
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  handle.enter();
                }}
              >
                ↗
              </a>
            </Fragment>
          ) : (
            tapestry.title
          )}
          <span
            style={{
              marginLeft: "auto",
              fontWeight: "normal",
              fontSize: "50%",
              userSelect: "none",
            }}
          >
            {showDetails ? (
              <span>
                Author: {tapestry.author}
                <span
                  style={{
                    fontStyle: "italic",
                    marginLeft: "1em",
                  }}
                >
                  {publicationStatus(tapestry.published)}
                </span>
              </span>
            ) : null}
            <a
              style={{ marginLeft: "1em" }}
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                setShowDetails(!showDetails);
              }}
            >
              {showDetails ? "Hide" : "Show"} details
            </a>
          </span>
        </h1>
      )}
      {showDetails ? (
        <TapestryInfo
          tapestry={tapestry}
          forkHistory={forkHistory}
          forkedFromThis={forkedFromThis}
          version={figureOutVersion()}
          setVersion={setVersion}
        />
      ) : (
        <FullScreen handle={handle}>
          <TapestryComponent
            tapestry={version}
            key={tapestry.id}
            isIframe={isIframe}
            isFullScreen={isFullScreen}
            setFullScreen={setIsFullScreen}
            noComments={noComments}
          />
        </FullScreen>
      )}
    </Fragment>
  );
}
