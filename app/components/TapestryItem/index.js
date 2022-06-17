import { memo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Comment,
  Expand,
  Collapse,
  WindowOpen,
  WindowClose,
} from "@styled-icons/boxicons-regular";
import { CommentIcon } from "./elements";
import BookFrame from "./BookFrame";
import TextFrame from "./TextFrame";
import WaybackMachineFrame from "./WaybackMachineFrame";
import WebFrame from "./WebFrame";
import BookImageFrame from "./BookImageFrame";
import TapestryLinkFrame from "./TapestryLinkFrame";
import AudioControllerFrame from "./AudioControllerFrame";
import SoftwareFrame from "./SoftwareFrame";
import ImageFrame from "./ImageFrame";
import AudioFrame from "./AudioFrame";
import VideoFrame from "./VideoFrame";
import TapestryIframe from "./TapestryIframe";
import IaFrame from "./IaFrame";
// import TapestryIcon from "./TapestryIcon";
import Config from "~/config";

const { zoomingMode, titleBarSelectsItem } = Config;

// TODO: bring title bar our of component?

const TapestryItem = ({
  item,
  focused,
  setFocus,
  setFocusElsewhere,
  comments,
  openComments,
  isPreview,
  isPreviewItem,
  style,
  onMouseEnter,
  onMouseLeave,
}) => {
  const [itemIsFullScreen, setItemIsFullScreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const itemHandle = useFullScreenHandle();
  return (
    <section
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      id={isPreviewItem ? `preview_${item.id}` : item.id}
      className={`tapestryItem ${focused ? "focused" : ""} ${
        item.type === "tapestrylink"
          ? "link"
          : item.type === "tapestry"
          ? "tapestryTapestryItem"
          : ""
      } ${item.hideTitle ? "hidetitle" : ""} ${showInfo ? "showinfo" : ""}`}
      style={
        isPreviewItem
          ? { gridArea: "initial", ...style }
          : {
              gridColumnStart: item.x,
              gridColumnEnd: item.x + item.width,
              gridRowStart: item.y,
              gridRowEnd: item.y + item.height,
              ...style,
            }
      }
      onClick={(e) => {
        if (!zoomingMode) {
          console.log("this is firign!");
          setFocus(e);
        }
      }}
    >
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
      <FullScreen handle={itemHandle}>
        {isPreviewItem || isPreview ? null : (
          <CommentIcon comments={comments} onClick={openComments}>
            <Comment />
          </CommentIcon>
        )}
        {item.type === "textFrame" ? (
          <TextFrame
            title={item.title}
            content={item.content}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "tapestrylink" ? (
          <TapestryLinkFrame title={item.title} link={item.url} />
        ) : item.type === "book" ? (
          <BookFrame
            title={item.title}
            url={item.url}
            thumbnail={item.thumbnail}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "bookimage" ? (
          <BookImageFrame
            title={item.title}
            url={item.url}
            thumbnail={item.thumbnail}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "image" ? (
          <ImageFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "audio" ? (
          <AudioFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "audiocontroller" ? (
          <AudioControllerFrame
            title={item.title}
            url={item.thumbnail}
            controlList={item.controlList}
            hideTitle={item.hideTitle}
            setFocus={setFocusElsewhere}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "video" ? (
          <VideoFrame
            title={item.title}
            url={item.url}
            thumbnail={item.thumbnail}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "web" ? (
          <WebFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "waybackmachine" ? (
          <WaybackMachineFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "software" ? (
          <SoftwareFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "iaresource" ? (
          <IaFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
            titleClick={(e) => {
              e.preventDefault();
              if (titleBarSelectsItem) {
                if (focused) {
                  setFocusElsewhere(e);
                } else {
                  setFocus(e);
                }
              }
            }}
          />
        ) : item.type === "tapestry" ? (
          <TapestryIframe
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
          />
        ) : (
          <p>
            Unrecognized item type: {item.title}
            <br />
            {JSON.stringify(item)}
          </p>
        )}
        <div className="backside">
          <h2 className="tapestryItemHead">{item.title}</h2>
          <div>
            <h3>Details</h3>
            <p>
              <strong>Source: </strong>{" "}
              {item.url ? <a href={item.url}>{item.url}</a> : item.content}
            </p>
            <button
              onClick={(e) => {
                e.preventDefault();
                setShowInfo(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      </FullScreen>
    </section>
  );
};

export default memo(TapestryItem);
