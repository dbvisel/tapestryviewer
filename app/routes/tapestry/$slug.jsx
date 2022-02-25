import { useCatch, useParams, useLoaderData } from "remix";
import invariant from "tiny-invariant";
import { getTapestries, getTapestryFromSlug } from "~/tapestryData";
import {
  getTapestriesForkedFromThisOne,
  getTapestryForkHistory,
} from "~/models/tapestry.mjs";
import { publicationStatus } from "~/utils/utils.mjs";
import TapestryInfo from "~/components/TapestryInfo";
import TapestryComponent from "~/components/TapestryComponent";

export const loader = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
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
  const { tapestry, forkHistory, forkedFromThis } = useLoaderData();
  const [showDetails, setShowDetails] = React.useState(false);
  return (
    <div>
      <h1>
        {tapestry.title}
        <span
          style={{
            marginLeft: "auto",
            fontWeight: "normal",
            fontSize: "50%",
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
              console.log("hi!");
              setShowDetails(!showDetails);
            }}
          >
            {showDetails ? "Hide" : "Show"} details
          </a>
        </span>
      </h1>
      {showDetails ? (
        <TapestryInfo
          tapestry={tapestry}
          forkHistory={forkHistory}
          forkedFromThis={forkedFromThis}
        />
      ) : (
        <TapestryComponent tapestry={tapestry} />
      )}
    </div>
  );
}
