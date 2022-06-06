import invariant from "tiny-invariant";
import { getTapestryFromSlug } from "~/tapestryData";

// This sends back JSON data for a given tapestry.

export const loader = async ({ params, request }) => {
  invariant(params.slug, "expected params.slug");
  const tapestry = await getTapestryFromSlug(params.slug);

  if (tapestry) {
    return new Response(JSON.stringify(tapestry), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } else {
    console.log("tapestry not found");
    throw new Response("Tapestry not found", {
      status: 404,
    });
  }
};
