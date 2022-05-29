import { Fragment } from "react";
import useKeypress from "react-use-keypress";
import { ZoomOut, ZoomIn, Share } from "@styled-icons/boxicons-regular";
import { getTransformSetting } from "~/utils/tapestryUtils";
import Config from "~/config";

const { useShareIcon, baseUrl, usePanButtons } = Config;

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
}) => {
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
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", " ", "Shift", "Enter"],
    (event) => {
      if (focused > -1) {
        event.preventDefault();
        if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
          goPrev();
        }

        if (event.code === "ArrowDown" || event.code === "ArrowRight") {
          // maybe preventDefault if it's arrow down? Arrowing down currently pans
          goNext();
        }
      } else {
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
        if (event.code === "ShiftLeft") {
          panTapestry(0, 0, -1);
        }
        if (event.code === "ShiftRight") {
          panTapestry(0, 0, 1);
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
            {isFullScreen ? "↙" : "↗"}
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
            {isFullScreen ? "↙" : "↗"}
          </button>
        )}
        {focused === -1 ? null : (
          <Fragment>
            <button
              className={focused === -1 ? "disabled" : ""}
              disabled={focused === -1}
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
            >
              ←
            </button>
            <button
              className={focused === -1 ? "disabled" : ""}
              disabled={focused === -1}
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
            >
              →
            </button>
          </Fragment>
        )}

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
    </Fragment>
  );
};

export default TapestryTools;
