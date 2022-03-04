import { Fragment, useEffect, useState, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TapestryItem from "~/components/TapestryItem";

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
    if (items[i].linksTo.length) {
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
  const transformerRef = useRef();
  const [focused, setFocused] = useState(-1);
  // get tapestry size.
  // console.log(calculateTapestrySize(tapestry.items));
  // make sure no items overlap?

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
        console.log(nextId);
        const nextItem = tapestry.items.find((item) => item.id === nextId);
        console.log(nextItem);
        const nextItemIndex = tapestry.items.indexOf(nextItem);
        console.log(nextItemIndex);
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
    if (transformerRef.current && focused > -1) {
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
                            key={index}
                            item={item}
                            focused={focused === index}
                            tabIndex={-1}
                            onKeyPress={(e) => {
                              e.stopPropagation();
                              console.log("firing on item!");
                              keyDownHandler(e);
                            }}
                            setFocus={(e) => {
                              e.stopPropagation();
                              setFocused(index);
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
                    style={{ position: "fixed", bottom: 0, right: 10 }}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocused(goPrev());
                      }}
                    >
                      &lt;
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFocused(goNext());
                      }}
                    >
                      &gt;
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
      </div>
    </Xwrapper>
  );
};

export default TapestryComponent;
