import { memo, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  Comment,
  Expand,
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
import TapestryIcon from "./TapestryIcon";
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
      } ${item.hideTitle ? "hidetitle" : ""}`}
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
      <FullScreen handle={itemHandle}>
        {item.type === "tapestrylink" ? null : (
          <a
            href="/#"
            className={`fullscreenicon ${
              item.type === "textFrame" ? "notapestryicon" : ""
            }`}
            onClick={(e) => {
              console.log("this is firing!");
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
            <Expand />
          </a>
        )}
        {item.type === "textFrame" || item.type === "tapestrylink" ? null : (
          <TapestryIcon item={item} />
        )}
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
                console.log("in titleclick");
                if (focused) {
                  console.log("unfocusing item");
                  setFocusElsewhere(e);
                } else {
                  console.log("focusing item");
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
          />
        ) : item.type === "image" ? (
          <ImageFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
          />
        ) : item.type === "audio" ? (
          <AudioFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
          />
        ) : item.type === "audiocontroller" ? (
          <AudioControllerFrame
            title={item.title}
            url={item.thumbnail}
            controlList={item.controlList}
            hideTitle={item.hideTitle}
            setFocus={setFocusElsewhere}
          />
        ) : item.type === "video" ? (
          <VideoFrame
            title={item.title}
            url={item.url}
            thumbnail={item.thumbnail}
            hideTitle={item.hideTitle}
          />
        ) : item.type === "web" ? (
          <WebFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
          />
        ) : item.type === "waybackmachine" ? (
          <WaybackMachineFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
          />
        ) : item.type === "software" ? (
          <SoftwareFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
          />
        ) : item.type === "iaresource" ? (
          <IaFrame
            title={item.title}
            url={item.url}
            hideTitle={item.hideTitle}
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
      </FullScreen>
    </section>
  );
};

export default memo(TapestryItem);
