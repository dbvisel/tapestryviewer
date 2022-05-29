import { useState } from "react";
import { useOutletContext } from "remix";
import Config from "~/config.js";

const { baseUrl } = Config;

const TestPage = () => {
  const { tapestries } = useOutletContext();
  const filteredTapestries = tapestries.filter((x) => !x.hideOnFront);
  const [width, setWidth] = useState(1024);
  const [height, setHeight] = useState(768);
  const [slug, setSlug] = useState(
    "introduction-to-the-digital-work-of-alex-itin"
  );
  return (
    <div style={{ margin: "20px", display: "flex", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1>Embed a tapestry as an iframe</h1>
        <iframe src={`/tapestry/${slug}`} width={width} height={height} />
        <h2>Choose the tapestry you'd like to include and the size:</h2>
        <p
          style={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <label style={{ display: "flex", alignItems: "baseline" }}>
            Tapestry:{" "}
            <select
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
              }}
            >
              {filteredTapestries.map((tapestry, index) => (
                <option key={index} value={tapestry.slug}>
                  {tapestry.title}
                </option>
              ))}
            </select>
          </label>
        </p>
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
        >{`<iframe src="${baseUrl}/tapestry/${slug}" width="${width}px" height="${height}px" allowfullscreen />`}</p>
      </div>
    </div>
  );
};
export default TestPage;
