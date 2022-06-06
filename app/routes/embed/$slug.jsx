import { useState } from "react";
import { useLoaderData } from "remix";
import invariant from "tiny-invariant";
import Config from "~/config.js";
import { getTapestryFromSlug } from "~/tapestryData";

export const loader = async ({ params, request }) => {
  invariant(params.slug, "expected params.slug");
  const tapestry = await getTapestryFromSlug(params.slug);

  if (tapestry) {
    return {
      tapestry: tapestry,
    };
  } else {
    console.log("tapestry not found");
    throw new Response("Tapestry not found", {
      status: 404,
    });
  }
};

const { baseUrl } = Config;

const TapestryEmbedPage = () => {
  const { tapestry } = useLoaderData();
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  return (
    <div style={{ margin: "20px", display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1>Embed “{tapestry.title}” as an iframe:</h1>
        <iframe
          title={tapestry.slug}
          src={`/tapestry/${tapestry.slug}`}
          width={width}
          height={height}
        />
        <p
          style={{
            marginTop: 0,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <label style={{ display: "flex", alignItems: "baseline" }}>
            Width:{" "}
            <input
              type="text"
              value={width}
              onChange={(e) => {
                const value = Math.abs(parseInt(e.target.value, 10));
                setWidth(value);
              }}
            />
            px
          </label>
          <label style={{ display: "flex", alignItems: "baseline" }}>
            Height:{" "}
            <input
              type="text"
              value={height}
              onChange={(e) => {
                const value = Math.abs(parseInt(e.target.value, 10));
                setHeight(value);
              }}
            />{" "}
            px
          </label>
        </p>
        <h2>Copy this HTML to embed this iframe in another page:</h2>
        <p
          style={{
            fontFamily: "monospace",
            boxSizing: "border-box",
            padding: "20px",
            background: "#ccc",
            color: "#333",
            maxWidth: `${width}px`,
            fontSize: "20px",
            borderRadius: "5px",
          }}
        >{`<iframe title="${tapestry.slug}" src="${baseUrl}/tapestry/${tapestry.slug}" width="${width}px" height="${height}px" allowfullscreen />`}</p>
      </div>
    </div>
  );
};
export default TapestryEmbedPage;
