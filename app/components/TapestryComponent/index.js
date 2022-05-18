import { Fragment, useEffect, useState, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import { FaShareAlt } from "react-icons/fa";
import TapestryItem from "~/components/TapestryItem";
import CommentDrawer from "~/components/CommentDrawer";
import { useNavigate } from "remix";

const useComments = false;
const zoomingMode = true;
const zoomWholeTapestry = false;

const calculateTapestrySize = (items) => {
  // this isn't currently used!
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < items.length; i++) {
    const thisItem = items[i];
    if (thisItem.x < minX) {
      minX = thisItem.x;
    }
    if (thisItem.y < minY) {
      minY = thisItem.y;
    }
    if (thisItem.x + thisItem.width > maxX) {
      maxX = thisItem.x + thisItem.width;
    }
    if (thisItem.y + thisItem.height > maxY) {
      maxY = thisItem.y + thisItem.height;
    }
  }
  return { minX, minY, maxX, maxY };
};

const makeLinkList = (items) => {
  const linksList = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].linksTo && items[i].linksTo.length) {
      for (let j = 0; j < items[i].linksTo.length; j++) {
        const linkTo = items[i].linksTo[j];
        const linkFrom = items[i].id;
        const link = {
          from: linkFrom,
          to: linkTo,
        };
        linksList.push(link);
      }
    }
  }
  return linksList;
};

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
  // get tapestry size.
  // console.log(calculateTapestrySize(tapestry.items));
  // make sure no items overlap?

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
          return i;
        }
      }
    }
    return -1;
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
        return nextItemIndex;
      }
    }
    return -1;
  };

  const keyDownHandler = (event) => {
    // TODO: why is this no longer firing?
    if (focused > -1) {
      event.preventDefault();
      if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
        setFocused(goPrev());
      }

      if (event.code === "ArrowDown" || event.code === "ArrowRight") {
        // maybe preventDefault if it's arrow down? Arrowing down currently pans
        setFocused(goNext());
      }
    }
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
        transformerRef.current.zoomToElement(tapestry.items[focused].id); // maybe zoom level should be set based on item height?
      } else {
        console.log("need to go full screen here!");
        const transformedStyle = viewportRef.current.querySelector(
          ".react-transform-component"
        ).style.transform;
        const transforms = transformedStyle
          .split("translate3d(")[1]
          .split(")")[0]
          .split("px, ")
          .map((x) => parseFloat(x));
        const zoom = Number(transformedStyle.split("scale(")[1].split(")")[0]);
        console.log(transforms, zoom);
        const newStyle = {
          position: "fixed",
          top: `calc(calc(0px - ${transforms[1]}px) * calc(1 / ${zoom}))`,
          left: `calc(calc(0px - ${transforms[0]}px) * calc(1 / ${zoom}))`,
          height: /*`calc(100vh - var(--headerHeight))`, //*/ `calc(100% * calc(1 / ${zoom}))`,
          width: /*"100vw", */ `calc(100% * calc(1 / ${zoom}))`,
          // maxHeight: `calc(100vh - var(--headerHeight))`,
          // maxWidth: `100vw`,
          // transform: `scale(${1 / zoom})`,
          zIndex: 999,
          width: `calc(100vw * ${1 / zoom})`,
          height: `calc(calc(100vh * ${1 / zoom}) - var(--headerHeight))`,
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
        onKeyDown={(e) => {
          e.stopPropagation();
          console.log("firing on viewport!");
          keyDownHandler(e);
        }}
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
              {({ zoomIn, zoomOut, resetTransform }) => {
                // console.log(focused);
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
                              hideComments={tapestry.id === "preview"}
                              onKeyPress={(e) => {
                                e.stopPropagation();
                                console.log("firing on item!");
                                keyDownHandler(e);
                              }}
                              useComments={useComments}
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
                                    resetTransform();
                                  } else {
                                    console.log("need to unzoom this item!");
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
                              setFocused(goPrev());
                            }}
                          >
                            ←
                          </button>
                          <button
                            className={focused === -1 ? "disabled" : ""}
                            disabled={focused === -1}
                            onClick={(e) => {
                              e.stopPropagation();
                              setFocused(goNext());
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
