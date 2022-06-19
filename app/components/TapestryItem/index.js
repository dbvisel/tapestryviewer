import { memo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { Comment } from "@styled-icons/boxicons-regular";
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
import ItemHeaderButtons from "./ItemHeaderButtons";

const { zoomingMode, titleBarSelectsItem } = Config;

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
          // console.log("this is firign!");
          setFocus(e);
        }
      }}
    >
      <FullScreen handle={itemHandle}>
        {isPreviewItem || isPreview ? null : (
          <CommentIcon comments={comments} onClick={openComments}>
            <Comment />
          </CommentIcon>
        )}
        <ItemHeaderButtons
          item={item}
          itemHandle={itemHandle}
          focused={focused}
          setFocus={setFocus}
          setFocusElsewhere={setFocusElsewhere}
          showInfo={showInfo}
          setShowInfo={setShowInfo}
        />
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
          <ItemHeaderButtons
            item={item}
            itemHandle={itemHandle}
            focused={focused}
            setFocus={setFocus}
            setFocusElsewhere={setFocusElsewhere}
            showInfo={showInfo}
            setShowInfo={setShowInfo}
          />
          <h2 className="tapestryItemHead">{item.title}</h2>
          <div>
            <h3>Details</h3>
            <p>
              <strong>Source: </strong>{" "}
              {item.url ? <a href={item.url}>{item.url}</a> : item.content}
            </p>
            <p>Internal data: {JSON.stringify(item)}</p>
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
