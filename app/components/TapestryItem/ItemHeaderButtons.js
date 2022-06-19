import { useState } from "react";
import {
  Expand,
  Collapse,
  WindowOpen,
  WindowClose,
} from "@styled-icons/boxicons-regular";
import Config from "~/config";
const { zoomingMode } = Config;

const ItemHeaderButtons = ({
  item,
  focused,
  itemHandle,
  setFocus,
  setFocusElsewhere,
  showInfo,
  setShowInfo,
}) => {
  const [itemIsFullScreen, setItemIsFullScreen] = useState(false);
  return (
    <nav style={{ backfaceVisibility: "hidden" }}>
      {zoomingMode && item.type !== "tapestrylink" ? (
        <a
          href="/#"
          className={`windowicon ${
            item.type === "textFrame" ? "notapestryicon" : ""
          }`}
          onClick={(e) => {
            console.log("this is firing!");
            e.preventDefault();
            if (focused) {
              setFocusElsewhere(e);
            } else {
              setFocus(e);
            }
          }}
        >
          {focused ? <WindowClose /> : <WindowOpen />}
        </a>
      ) : null}
      {item.type === "tapestrylink" ? null : (
        <a
          href="/#"
          className={`fullscreenicon ${
            item.type === "textFrame" ? "notapestryicon" : ""
          }`}
          onClick={(e) => {
            // console.log("this is firing!");
            e.preventDefault();
            if (itemIsFullScreen) {
              itemHandle.exit();
              setItemIsFullScreen(false);
            } else {
              itemHandle.enter();
              setItemIsFullScreen(true);
            }
          }}
        >
          {itemIsFullScreen ? <Collapse /> : <Expand />}
        </a>
      )}
      {item.type === "textFrame" || item.type === "tapestrylink" ? null : (
        <a
          href="/#"
          className={`tapestryIcon ${showInfo ? "on" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setShowInfo(!showInfo);
            // setShown(!shown);
          }}
        >
          i
        </a>
        // <TapestryIcon item={item} />
      )}
    </nav>
  );
};

export default ItemHeaderButtons;
