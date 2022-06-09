import React, { Fragment, useEffect, useState, useRef } from "react";
import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import TapestryItem from "~/components/TapestryItem";
import CommentDrawer from "~/components/CommentDrawer";
import TapestryTools from "./TapestryTools";
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

const defocus = () => {
  if (document) {
    if (document.activeElement === document.getElementsByTagName("iframe")[0]) {
      // if we are an iframe, blur
      document.activeElement.blur();
    }
  }
  return null;
};

const TapestryComponent = ({
  tapestry,
  isIframe,
  isFullScreen,
  setFullScreen,
  noCommentDrawer,
  setTitle,
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
  const [over, setOver] = useState(-1);
  const [itemStyle, setItemStyle] = useState({
    top: "initial",
    left: "initial",
    width: "initial",
    height: "initial",
  });
  const [transformStyle, setTransformStyle] = useState("");

  const updateXarrow = useXarrow();

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
  }, [initialScale, tapestry]);

  useEffect(() => {
    const buildCommentCount = async () => {
      // console.log("Building comment count!");
      if (tapestry.id === "preview") {
        setLoading(false);
        return;
      }
      const hashList = tapestry.items.map((item) => item.hash);
      await getComments(hashList);
      // await updateXarrow();
    };
    if (useComments) {
      buildCommentCount();
    }
  }, [tapestry, setTitle]);

  useEffect(() => {
    if (focused > -1) {
      // console.log(tapestry.items[focused].title);
      setTitle(tapestry.items[focused].title);
    } else {
      setTitle("");
    }
    if (
      focused > -1 &&
      transformerRef.current &&
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
  }, [focused, setTitle, tapestry]);

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
          // TODO: this is firing when an item is clicked!
          console.log("this is firing in tapestry component!");
          defocus();
          // TODO: this should set the zoom center to mouse X, mouse Y. Maybe that should happen in controls?
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
                                  defocus();
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
                              onMouseEnter={(e) => {
                                setOver(index);
                              }}
                              onMouseLeave={(e) => {
                                setOver(-1);
                              }}
                              currentZoom={1}
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
                    <TapestryTools
                      focused={focused}
                      setFocused={(x) => {
                        if (x > -1) {
                          setFocused(x);
                        } else {
                          defocus();
                          setFocused(-1);
                          if (zoomWholeTapestry) {
                            // TODO: break this down into x, y, and zoom
                            const values = getTransformSetting(transformStyle);
                            setTransform(values[0], values[1], values[2]);
                            // resetTransform();
                          } else {
                            setItemStyle({});
                          }
                        }
                      }}
                      isFullScreen={isFullScreen}
                      setFullScreen={setFullScreen}
                      commentShown={commentShown}
                      zoomIn={zoomIn}
                      zoomOut={zoomOut}
                      resetTransform={resetTransform}
                      viewportRef={viewportRef}
                      updateXarrow={updateXarrow}
                      items={tapestry.items}
                      slug={tapestry.slug}
                      setTransform={setTransform}
                      isIframe={isIframe}
                      over={over}
                    />
                  </Fragment>
                );
              }}
            </TransformWrapper>
          </div>
        )}
      </div>
      {tapestry.id === "preview" || noCommentDrawer ? null : (
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
