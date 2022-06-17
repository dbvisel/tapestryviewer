import { Fragment, useState } from "react";
import useKeypress from "react-use-keypress";
import {
  ZoomOut,
  ZoomIn,
  Share,
  Expand,
  Collapse,
  WindowOpen,
  WindowClose,
} from "@styled-icons/boxicons-regular";
import { getTransformSetting } from "~/utils/tapestryUtils";
import { HelpDiv } from "./elements";
import Config from "~/config";

const {
  useShareIcon,
  baseUrl,
  usePanButtons,
  useHelpButton,
  useComponentZoom,
} = Config;

// TODO: This is rendering too often! Why? Memoing doesn't help.

const TapestryTools = ({
  focused,
  setFocused,
  isFullScreen,
  setFullScreen,
  commentShown,
  zoomIn,
  zoomOut,
  resetTransform,
  viewportRef,
  updateXarrow,
  items,
  setTransform,
  slug,
  isIframe,
  over, // would be nice to reduce these props!
}) => {
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const focusedAndHasConnections =
    focused > -1 &&
    (items[focused].linksTo.length > 0 ||
      items.flatMap((x) => x.linksTo).indexOf(items[focused].id) > -1); // this is to check if the item is linked by some other item

  const goPrev = () => {
    if (focused > -1) {
      const currentId = items[focused].id;
      for (let i = 0; i < items.length; i++) {
        if (
          items[i].linksTo &&
          items[i].linksTo.length &&
          items[i].linksTo[0] === currentId
        ) {
          // note that this goes to the first LinkTo that points to the current focused ID
          return setFocused(i);
        }
      }
    }
    return null;
  };

  const goNext = () => {
    if (focused > -1) {
      if (items[focused].linksTo && items[focused].linksTo.length) {
        // Known issue: if this links to more than one thing, it's only taking the first.
        const nextId = items[focused].linksTo[0];
        const nextItem = items.find((item) => item.id === nextId);
        const nextItemIndex = items.indexOf(nextItem);
        return setFocused(nextItemIndex);
      }
    }
    return null;
  };

  const panTapestry = (dx = 0, dy = 0, dz = 0) => {
    const move = 200; // what should this be?
    const zoomSetting = 1.25;
    if (viewportRef && viewportRef.current) {
      const currentTransform = getTransformSetting(
        viewportRef.current.querySelector(".react-transform-component").style
          .transform
      );
      viewportRef.current.querySelector(
        ".react-transform-component"
      ).style.transition = 0.5;
      currentTransform[1] = currentTransform[1] + dy * move;
      currentTransform[0] = currentTransform[0] + dx * move;
      if (dz !== 0) {
        if (dz > 0) {
          currentTransform[2] = currentTransform[2] * zoomSetting;
        } else {
          currentTransform[2] = currentTransform[2] / zoomSetting;
        }
      }
      setTransform(
        currentTransform[0],
        currentTransform[1],
        currentTransform[2]
      );
      // viewportRef.current.querySelector(
      //   ".react-transform-component"
      // ).style.transform = `translate3d(${currentTransform[0]}px, ${currentTransform[1]}px, 0px) scale(${currentTransform[2]})`;
      updateXarrow();
    }
  };

  useKeypress(
    [
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      " ",
      "Shift",
      "Enter",
      "?",
      "/",
      "-",
      "=",
    ],
    (event) => {
      if (focused > -1) {
        event.preventDefault();
        if (event.code === "Enter") {
          setFocused(-1);
        }

        if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
          goPrev();
        }

        if (event.code === "ArrowDown" || event.code === "ArrowRight") {
          // maybe preventDefault if it's arrow down? Arrowing down currently pans
          goNext();
        }
      } else {
        // if we are here, we are unfocused
        if (event.key === "?" || event.key === "/") {
          setHelpModalOpen(!helpModalOpen);
          return;
        }
        if (event.code === "ArrowUp") {
          panTapestry(0, 1, 0);
        }
        if (event.code === "ArrowDown") {
          panTapestry(0, -1, 0);
        }
        if (event.code === "ArrowLeft") {
          panTapestry(1, 0, 0);
        }
        if (event.code === "ArrowRight") {
          panTapestry(-1, 0, 0);
        }
        if (event.code === "ShiftLeft" || event.key === "-") {
          if (useComponentZoom) {
            zoomOut();
          } else {
            panTapestry(0, 0, -1);
          }
        }
        if (event.code === "ShiftRight" || event.key === "=") {
          if (useComponentZoom) {
            zoomIn();
          } else {
            panTapestry(0, 0, 1);
          }
        }
        if (event.code === "Enter") {
          setFocused(over);
        }
        if (event.code === "Space") {
          // this resets it.
          resetTransform();
          updateXarrow();
          return;
        }
      }
    }
  );
  // console.log(over);
  return (
    <Fragment>
      {usePanButtons ? (
        <div className="panbuttons">
          <button
            className="up"
            onClick={(e) => {
              e.stopPropagation();
              panTapestry(0, 1, 0);
            }}
          >
            ↑
          </button>
          <button
            className="left"
            onClick={(e) => {
              e.stopPropagation();
              panTapestry(1, 0, 0);
            }}
          >
            ←
          </button>
          <button
            className="right"
            onClick={(e) => {
              e.stopPropagation();
              panTapestry(-1, 0, 0);
            }}
          >
            →
          </button>
          <button
            className="down"
            onClick={(e) => {
              e.stopPropagation();
              panTapestry(0, -1, 0);
            }}
          >
            ↓
          </button>
          <button
            className="fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              setFullScreen(!isFullScreen);
            }}
          >
            {isFullScreen ? <Collapse /> : <Expand />}
          </button>
        </div>
      ) : null}
      <div
        className="tools"
        style={{
          transform: `translateX(${
            commentShown ? "calc(0px - var(--commentWidth))" : "0px"
          })`,
        }}
      >
        {usePanButtons ? null : (
          <button
            className="fullscreen"
            onClick={(e) => {
              e.stopPropagation();
              setFullScreen(!isFullScreen);
            }}
          >
            {isFullScreen ? <Collapse /> : <Expand />}
          </button>
        )}
        {focusedAndHasConnections ? (
          <Fragment>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              ←
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              →
            </button>
          </Fragment>
        ) : null}

        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomOut();
          }}
        >
          <ZoomOut />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            resetTransform();
          }}
        >
          Reset
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            zoomIn();
          }}
        >
          <ZoomIn />
        </button>
        {useHelpButton ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setHelpModalOpen(!helpModalOpen);
            }}
          >
            ?
          </button>
        ) : null}
      </div>
      {isIframe || !useShareIcon ? null : (
        <a
          href="/#"
          className="shareicon"
          onClick={(e) => {
            e.preventDefault();
            const myCode = `<iframe src="${baseUrl}/tapestry/${slug}" width="1024px" height="768px" allowfullscreen />`;
            console.log(myCode);
            navigator.permissions
              .query({ name: "clipboard-write" })
              .then((result) => {
                if (result.state == "granted" || result.state == "prompt") {
                  navigator.clipboard.writeText(myCode);
                  // TODO: fix this.
                  // window.alert(
                  //   `To embed this tapestry in an iframe, use this:\n\n${myCode}\n\nIt's in your clipboard now.`
                  // );
                }
              });
          }}
        >
          <Share style={{ width: "24px", height: "24px" }} />
        </a>
      )}
      {helpModalOpen ? (
        <HelpDiv
          className="helpscrim"
          onClick={(e) => {
            e.preventDefault();
            setHelpModalOpen(false);
          }}
        >
          <h2>Tapestry help</h2>
          <div>
            <div>
              <h3>Keyboard commands</h3>
              <ul>
                <li>
                  <strong>Left shift key</strong> or <strong>-:</strong> zoom
                  out
                </li>
                <li>
                  <strong>Right shift key</strong> or <strong>+:</strong> zoom
                  in
                </li>
                <li>
                  <strong>Space bar:</strong> reset zoom to default
                </li>
                <li>
                  <strong>Arrow keys:</strong> pan tapestry
                </li>
                <li>
                  <strong>Return</strong> (when over an item): focus on that
                  item
                </li>
                <li>
                  <strong>?</strong>: open this help screen
                </li>
              </ul>
            </div>
            <div>
              <h3>Icons on items</h3>
              <ul>
                <li>
                  <WindowOpen width={24} height={24} /> focus an item (makes it
                  fullscreen)
                </li>
                <li>
                  <WindowClose width={24} height={24} /> unfocus an item
                </li>
                <li>
                  <Expand width={24} height={24} /> enter full screen
                </li>
                <li>
                  <Collapse width={24} height={24} /> leave full screen
                </li>
                <li>
                  <span
                    style={{
                      width: "20px",
                      height: "20px",
                      display: "inline-flex",
                      justifyContent: "center",
                      alignItems: "center",
                      border: "2px solid white",
                      borderRadius: "100%",
                    }}
                  >
                    i
                  </span>{" "}
                  get item details
                </li>
              </ul>
            </div>
          </div>
          <p style={{ textAlign: "center" }}>
            Click this screen to make it go away!
          </p>
        </HelpDiv>
      ) : null}
    </Fragment>
  );
};

export default TapestryTools;
