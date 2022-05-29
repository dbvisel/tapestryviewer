import { Fragment } from "react";
import useKeypress from "react-use-keypress";
import { ZoomOut, ZoomIn } from "@styled-icons/boxicons-regular";
import { getTransformSetting } from "~/utils/tapestryUtils";

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
        const move = 200; // what should this be?
        if (viewportRef && viewportRef.current) {
          const currentTransform = getTransformSetting(
            viewportRef.current.querySelector(".react-transform-component")
              .style.transform
          );
          viewportRef.current.querySelector(
            ".react-transform-component"
          ).style.transition = 0.5;
          if (event.code === "ArrowUp") {
            currentTransform[1] = currentTransform[1] + move;
          }
          if (event.code === "ArrowDown") {
            currentTransform[1] = currentTransform[1] - move;
          }
          if (event.code === "ArrowLeft") {
            currentTransform[0] = currentTransform[0] + move;
          }
          if (event.code === "ArrowRight") {
            currentTransform[0] = currentTransform[0] - move;
          }
          if (event.code === "ShiftLeft") {
            currentTransform[2] = currentTransform[2] / 1.25;
          }
          if (event.code === "ShiftRight") {
            currentTransform[2] = currentTransform[2] * 1.25;
          }
          if (event.code === "Space") {
            // this resets it.
            resetTransform();
            updateXarrow();
            return;
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
      }
    }
  );

  return (
    <div
      className="tools"
      style={{
        transform: `translateX(${
          commentShown ? "calc(0px - var(--commentWidth))" : "0px"
        })`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setFullScreen(!isFullScreen);
        }}
      >
        {isFullScreen ? "↙" : "↗"}
      </button>
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
          zoomIn();
        }}
      >
        <ZoomIn />
      </button>
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
    </div>
  );
};

export default TapestryTools;
