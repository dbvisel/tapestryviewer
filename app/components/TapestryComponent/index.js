import React, { Fragment, useEffect, useState, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import useKeypress from "react-use-keypress";
import { FaShareAlt } from "react-icons/fa";
import TapestryItem from "~/components/TapestryItem";
import CommentDrawer from "~/components/CommentDrawer";
import { useNavigate } from "remix";
import Config from "~/config";
import {
  calculateTapestrySize,
  makeLinkList,
  getTransformSetting,
} from "~/utils/tapestryUtils";

const { useComments, zoomingMode, zoomWholeTapestry } = Config;

if (typeof document === "undefined") {
  React.useLayoutEffect = React.useEffect;
}

const TapestryComponent = ({
  tapestry,
  isIframe,
  isFullScreen,
  setFullScreen,
  noComments,
}) => {
  let navigate = useNavigate();

  const transformerRef = useRef();
  const viewportRef = useRef();
  const [focused, setFocused] = useState(-1);
  const [commentShown, setCommentShown] = useState(false);
  const [commentCounts, setCommentCounts] = useState([]);
  const [flag, setFlag] = useState("1");
  const [loading, setLoading] = useState(useComments);
  const [initialScale, setInitialScale] = useState(0);
  const [itemStyle, setItemStyle] = useState({
    top: "initial",
    left: "initial",
    width: "initial",
    height: "initial",
  });
  const [transformStyle, setTransformStyle] = useState("");

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
        const move = 200;
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
          // if (event.code === "Space") {
          //   // this resets it.
          //   currentTransform[0] = tapestry.initialView
          //     ? 0 - tapestry.initialX
          //     : 0;
          //   currentTransform[1] = tapestry.initialView
          //     ? 0 - tapestry.initialY
          //     : 0;
          //   currentTransform[2] = tapestry.initialView
          //     ? tapestry.defaultZoom
          //     : initialScale;
          // }
          viewportRef.current.querySelector(
            ".react-transform-component"
          ).style.transform = `translate3d(${currentTransform[0]}px, ${currentTransform[1]}px, 0px) scale(${currentTransform[2]})`;
          // TODO: This should pan for arrow keys!
        }
      }
    }
  );

  const getComments = async (hashList) => {
    if (useComments) {
      console.log("Loading comments for items on the tapestry.");
      let outList = [];
      await fetch("/.netlify/functions/comment", {
        method: "GET",
      })
        .then((res) => res.json())
        .then(async (serverComments) => {
          // console.log(serverComments, hashList);
          if (serverComments.length) {
            for (let i = 0; i < hashList.length; i++)
              outList[i] = serverComments.filter(
                (x) => parseInt(x.referent, 10) === hashList[i]
              ).length;
          }
          setCommentCounts(outList);
          setFlag("2");
          setLoading(false);
          return outList;
        })
        .catch((e) => {
          console.log("There was an error:", e);
          setLoading(false);
          return [];
        });
    }
  };

  const linksList = makeLinkList(tapestry.items);
  // console.log(linksList);
  const updateXarrow = useXarrow();

  const goPrev = () => {
    if (focused > -1) {
      const currentId = tapestry.items[focused].id;
      for (let i = 0; i < tapestry.items.length; i++) {
        if (
          tapestry.items[i].linksTo &&
          tapestry.items[i].linksTo.length &&
          tapestry.items[i].linksTo[0] === currentId
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
      if (
        tapestry.items[focused].linksTo &&
        tapestry.items[focused].linksTo.length
      ) {
        // Known issue: if this links to more than one thing, it's only taking the first.
        const nextId = tapestry.items[focused].linksTo[0];
        const nextItem = tapestry.items.find((item) => item.id === nextId);
        const nextItemIndex = tapestry.items.indexOf(nextItem);
        return setFocused(nextItemIndex);
      }
    }
    return null;
  };

  useEffect(() => {
    // console.log("tapestryID changed!");
    setInitialScale(0);
  }, [tapestry.id]);

  useEffect(() => {
    if (!initialScale && viewportRef.current) {
      const viewport = viewportRef.current.getBoundingClientRect();
      const viewH = viewport.height;
      const viewW = viewport.width;
      // console.log("viewport: ", viewW, viewH);
      const tapestryDimensions = calculateTapestrySize(tapestry.items);
      const tapestryWidth =
        (tapestryDimensions.maxX - 1) * tapestry.gridUnitSize +
        tapestry.gridGap * (tapestryDimensions.maxX - 2);
      const tapestryHeight =
        (tapestryDimensions.maxY - 1) * tapestry.gridUnitSize +
        tapestry.gridGap * (tapestryDimensions.maxY - 2);
      // console.log("tapestry: ", tapestryWidth, tapestryHeight);
      const scaleW = viewW / tapestryWidth;
      const scaleH = viewH / tapestryHeight;
      const scale = Math.min(scaleW, scaleH);
      // console.log("scale: ", scale);
      setInitialScale(scale);
    }
  }, [initialScale]);

  useEffect(async () => {
    // console.log("Building comment count!");
    if (tapestry.id === "preview") {
      setLoading(false);
      return;
    }
    const hashList = tapestry.items.map((item) => item.hash);
    await getComments(hashList);
    // await updateXarrow();
  }, []);

  useEffect(() => {
    if (
      transformerRef.current &&
      focused > -1 &&
      tapestry.id !== "preview" &&
      zoomingMode
    ) {
      if (zoomWholeTapestry) {
        const transformedStyle = viewportRef.current.querySelector(
          ".react-transform-component"
        ).style.transform;
        setTransformStyle(transformedStyle);
        // console.log(transform);
        // console.log(transformedStyle);
        transformerRef.current.zoomToElement(tapestry.items[focused].id); // maybe zoom level should be set based on item height?
      } else {
        // console.log("need to go full screen here!");
        const transformedStyle = viewportRef.current.querySelector(
          ".react-transform-component"
        ).style.transform;
        const transforms = transformedStyle
          .split("translate3d(")[1]
          .split(")")[0]
          .split("px, ")
          .map((x) => parseFloat(x));
        const zoom = Number(transformedStyle.split("scale(")[1].split(")")[0]);
        // console.log(transforms, zoom);
        const newStyle = {
          position: "fixed",
          zoom: `${1 / zoom}`,
          // top: `calc(calc(0px - ${transforms[1]}px) * calc(1 / ${zoom}))`,
          // left: `calc(calc(0px - ${transforms[0]}px) * calc(1 / ${zoom}))`,
          // height: /*`calc(100vh - var(--headerHeight))`, //*/ `calc(100% * calc(1 / ${zoom}))`,
          // width: /*"100vw", */ `calc(100% * calc(1 / ${zoom}))`,
          // maxHeight: `calc(100vh - var(--headerHeight))`,
          // maxWidth: `100vw`,
          // transform: `scale(${1 / zoom})`,
          // width: `calc(100vw * ${1 / zoom})`,
          // height: `calc(calc(100vh * ${1 / zoom}) - var(--headerHeight))`,
          zIndex: 999,
          top: `calc(calc(0px - ${transforms[1]}px) * 1)`,
          left: `calc(calc(0px - ${transforms[0]}px) * 1)`,
          width: `calc(100vw * ${1})`,
          height: `calc(calc(100vh * ${1}) - var(--headerHeight))`,
        };
        setItemStyle(newStyle);
        // console.log(newStyle);

        // top: calc( calc(0px - y) * calc(1 / zoom))
        // left: calc( calc(0px - x) * calc(1 / zoom))
        // height: calc(100% * calc (1 / zoom))
        // width: calc(100% * calc (1 / zoom))
      }
    }
  }, [focused]);

  return (
    <Xwrapper>
      <div
        key={tapestry.id}
        className="viewport"
        ref={viewportRef}
        style={{
          padding:
            isFullScreen || zoomingMode ? "0px" : isIframe ? "10px" : "20px",
          boxSizing: "border-box",
          background: tapestry.background,
          backgroundSize: "cover",
          "--gridUnitSize": `${tapestry.gridUnitSize}px`,
          "--gridGap": `${tapestry.gridGap}px`,
        }} // "cover" isn't firing sometimes!
        onClick={(e) => {
          e.stopPropagation();
          setFocused(-1);
        }}
      >
        {loading || !initialScale ? (
          <p className="loadingmessage">Loading comments . . .</p>
        ) : (
          <div
            className="scroller"
            // onScroll={updateXarrow}
            style={{ padding: 0, margin: 0 }}
          >
            <TransformWrapper
              initialScale={
                tapestry.initialView ? tapestry.defaultZoom : initialScale
              }
              minScale={0.5}
              maxScale={5}
              centerOnInit={false}
              limitToBounds={false}
              onPanningStop={updateXarrow}
              onZoomStop={updateXarrow}
              onPinchingStop={updateXarrow}
              onWheelStop={updateXarrow}
              initialPositionX={
                tapestry.initialView ? 0 - tapestry.initialX : 0
              }
              initialPositionY={
                tapestry.initialView ? 0 - tapestry.initialY : 0
              }
              ref={transformerRef}
              // panning={{ disabled: focused !== -1, velocityDisabled: true }}
              // panning={{
              //   disabled: true,
              //   disableOnTarget: [".textframe", "select", "waybackslider"],
              // }}
            >
              {({ zoomIn, zoomOut, resetTransform, setTransform }) => {
                return (
                  <Fragment>
                    <TransformComponent
                      wrapperStyle={{
                        maxWidth: "100%",
                        height: isFullScreen ? "100vh" : "fit-content",
                        maxHeight: "calc(100vh - var(--headerHeight))",
                      }}
                    >
                      <article
                        className="tapestryGrid"
                        style={{
                          minWidth: "100vw",
                          minHeight: "calc(100vh - var(--headerHeight)",
                        }}
                      >
                        {tapestry.items.length ? (
                          tapestry.items.map((item, index) => (
                            <TapestryItem
                              key={`${flag}_${index}`}
                              item={item}
                              focused={
                                focused === index && tapestry.id !== "preview"
                              }
                              tabIndex={-1 * index}
                              comments={commentCounts[index] || 0}
                              isPreview={tapestry.id === "preview"}
                              openComments={(e) => {
                                e.stopPropagation();
                                if (!tapestry.id !== "preview") {
                                  setFocused(index);
                                  setCommentShown(!commentShown);
                                }
                              }}
                              setFocus={(e) => {
                                if (item.type === "tapestrylink") {
                                  navigate(`/tapestry/${item.url}`, {
                                    replace: true,
                                  });
                                } else {
                                  e.stopPropagation();
                                  if (tapestry.id !== "preview") {
                                    setFocused(index);
                                  }
                                }
                              }}
                              setFocusElsewhere={(e) => {
                                const newFocused = tapestry.items.findIndex(
                                  (x) => x.googleId === e
                                );
                                if (newFocused > -1) {
                                  setFocused(newFocused);
                                } else {
                                  // if we're here, we're resetting focus
                                  setFocused(-1);
                                  if (zoomWholeTapestry) {
                                    // TODO: break this down into x, y, and zoom
                                    const values =
                                      getTransformSetting(transformStyle);
                                    setTransform(
                                      values[0],
                                      values[1],
                                      values[2]
                                    );
                                    // resetTransform();
                                  } else {
                                    setItemStyle({});
                                  }
                                }
                              }}
                              zoomingMode={zoomingMode}
                              style={
                                focused === index &&
                                tapestry.id !== "preview" &&
                                zoomingMode &&
                                !zoomWholeTapestry
                                  ? itemStyle
                                  : null
                              }
                            />
                          ))
                        ) : (
                          <p>(No items on this tapestry.)</p>
                        )}
                      </article>
                    </TransformComponent>
                    {linksList.map((link, index) =>
                      tapestry.items.filter((x) => x.id === link.to).length ? (
                        <Xarrow
                          key={index}
                          start={link.from} //can be react ref
                          end={link.to} //or an id
                          curveness={0.5}
                        />
                      ) : null
                    )}
                    <div
                      className="tools"
                      style={{
                        transform: `translateX(${
                          commentShown
                            ? "calc(0px - var(--commentWidth))"
                            : "0px"
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
                        +
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          zoomOut();
                        }}
                      >
                        -
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
                  </Fragment>
                );
              }}
            </TransformWrapper>
          </div>
        )}
      </div>
      {tapestry.id === "preview" || noComments ? null : (
        <CommentDrawer
          commentShown={commentShown}
          setCommentShown={setCommentShown}
          focused={focused}
          tapestry={tapestry}
        />
      )}
      {isIframe || true ? null : (
        <a
          href="/#"
          className="shareicon"
          onClick={(e) => {
            e.preventDefault();
            const myCode = `<iframe src="https://tapestryviewer.netlify.app/tapestry/${tapestry.slug}" width="1024px" height="768px" allowfullscreen />`;
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
          <FaShareAlt style={{ width: "24px", height: "24px" }} />
        </a>
      )}
    </Xwrapper>
  );
};

export default TapestryComponent;
