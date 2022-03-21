import { Fragment, useEffect, useState, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TapestryItem from "~/components/TapestryItem";
import CommentDrawer from "~/components/CommentDrawer";

const useComments = true;

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

const TapestryComponent = ({ tapestry }) => {
  // console.log(tapestry);
  const transformerRef = useRef();
  const [focused, setFocused] = useState(-1);
  const [commentShown, setCommentShown] = useState(false);
  const [commentCounts, setCommentCounts] = useState([]);
  const [flag, setFlag] = useState("1");
  const [loading, setLoading] = useState(useComments);
  // get tapestry size.
  // console.log(calculateTapestrySize(tapestry.items));
  // make sure no items overlap?

  const getComments = async (hashList) => {
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
    if (transformerRef.current && focused > -1 && !tapestry.id === "preview") {
      transformerRef.current.zoomToElement(tapestry.items[focused].id); // maybe zoom level should be set based on item height?
    }
  }, [focused]);

  return (
    <Xwrapper>
      <div
        key={tapestry.id}
        className="viewport"
        style={{
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
        {loading ? (
          <p className="loadingmessage">Loading comments . . .</p>
        ) : (
          <div
            className="scroller"
            // onScroll={updateXarrow}
            style={{ padding: 0, margin: 0 }}
          >
            <TransformWrapper
              initialScale={1.0}
              // initialPositionX={25}
              // initialPositionY={25}
              minScale={0.5}
              maxScale={5}
              centerOnInit={false}
              limitToBounds={false}
              onPanningStop={updateXarrow}
              onZoomStop={updateXarrow}
              onPinchingStop={updateXarrow}
              onWheelStop={updateXarrow}
              ref={transformerRef}
            >
              {({ zoomIn, zoomOut, resetTransform }) => {
                // console.log(focused);
                return (
                  <Fragment>
                    <TransformComponent
                      wrapperStyle={{
                        maxWidth: "100%",
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
                              tabIndex={-1}
                              comments={commentCounts[index] || 0}
                              hideComments={tapestry.id === "preview"}
                              onKeyPress={(e) => {
                                e.stopPropagation();
                                console.log("firing on item!");
                                keyDownHandler(e);
                              }}
                              openComments={(e) => {
                                e.stopPropagation();
                                if (!tapestry.id !== "preview") {
                                  setFocused(index);
                                  setCommentShown(!commentShown);
                                }
                              }}
                              setFocus={(e) => {
                                e.stopPropagation();
                                if (tapestry.id !== "preview") {
                                  setFocused(index);
                                }
                              }}
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
      {tapestry.id === "preview" ? null : (
        <CommentDrawer
          commentShown={commentShown}
          setCommentShown={setCommentShown}
          focused={focused}
          tapestry={tapestry}
        />
      )}
    </Xwrapper>
  );
};

export default TapestryComponent;
