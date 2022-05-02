import ReactAudioPlayer from "react-audio-player";
import { Fragment, useState } from "react";
import { Link } from "remix";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import throbber from "./images/Loading_icon_cropped.gif";
import { Comment, Expand } from "@styled-icons/boxicons-regular";
import styled from "styled-components";

const hideThumbnail = true;

const CommentIcon = styled.span`
  width: 30px;
  height: 30px;
  position: absolute;
  right: -35px;
  top: 6px;
  fill: black;
  cursor: pointer;
  user-select: none;
  opacity: ${(props) => (props.comments ? 1 : 0.25)};
  transition: 0.25s;
  &:after {
    content: "${(props) => (props.comments ? props.comments : "")}";
    top: -30px;
    left: 35px;
    position: relative;
  }
  &:hover {
    opacity: 1;
  }
`;

const TextFrame = ({ title, content, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame textframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const TapestryLinkFrame = ({ title, link }) => (
  <div
    className={`frame tapestrylinkframe`}
    // onClick={() => {
    //   console.log("clicked!");
    // }}
  >
    <Link to={`/tapestry/${link}`} tabIndex={-1}>
      {title}
    </Link>
  </div>
);

const BookFrame = ({ title, url, thumbnail, hideTitle }) => {
  const [clicked, setClicked] = React.useState(false);
  return (
    <div className={`${hideTitle ? "notitle" : ""}  frame bookframe`}>
      {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
      {clicked || !thumbnail || hideThumbnail ? (
        <iframe
          src={url}
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <img
          src={thumbnail}
          className="thumbnail"
          onClick={() => setClicked(true)}
        />
      )}
    </div>
  );
};

const BookImageFrame = ({ title, url, thumbnail, hideTitle }) => {
  console.log(url, thumbnail);
  return (
    <div className={`${hideTitle ? "notitle" : ""}  frame bookframe`}>
      {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
      <img src={thumbnail} className="thumbnail" />
    </div>
  );
};

const ImageFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame imageframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

const VideoFrame = ({ title, url, thumbnail, hideTitle }) => {
  const [clicked, setClicked] = React.useState(false);
  return (
    <div className={`${hideTitle ? "notitle" : ""} frame videoframe`}>
      {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
      {clicked || !thumbnail || hideThumbnail ? (
        <iframe
          src={url}
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <img
          src={thumbnail}
          className="thumbnail"
          onClick={() => setClicked(true)}
        />
      )}
    </div>
  );
};

const SoftwareFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame videoframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

const IaFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame videoframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

const AudioFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame audioframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div>
      <iframe
        src={url}
        height={url.indexOf(`/embed/`) > -1 ? 36 : "100%"}
        width={"100%"}
        frameBorder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowFullScreen
        loading="lazy"
      />
    </div>
  </div>
);

const AudioControllerFrame = ({
  title,
  url,
  hideTitle,
  controlList,
  setFocus,
}) => {
  const [currentId, setCurrentId] = useState("");
  const sortedControlList = controlList.sort((a, b) => {
    if (a.time > b.time) return 1;
    if (a.time < b.time) return -1;
    return 0;
  });
  return (
    <div className={`${hideTitle ? "notitle" : ""} frame audioframe`}>
      {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
      <div>
        <ReactAudioPlayer
          src={url}
          crossOrigin
          controls
          listenInterval={500}
          onListen={(e) => {
            const currentTime = e * 1000;

            if (currentTime < sortedControlList[0].time) return;

            for (
              let i = sortedControlList.length - 1;
              i < sortedControlList.length;
              i--
            ) {
              if (currentTime > sortedControlList[i].time) {
                setCurrentId(sortedControlList[i].id);
                setFocus(sortedControlList[i].id);
                break;
              }
            }
          }}
        />
      </div>
    </div>
  );
};

const WebFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame webframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div>
      <img src={throbber} />
    </div>
    <iframe
      src={url}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

const TapestryIcon = ({ item }) => {
  const [shown, setShown] = useState(false);
  return (
    <Fragment>
      <a
        href="/#"
        className={`tapestryIcon ${shown ? "on" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShown(!shown);
        }}
      >
        i
      </a>
      {shown ? (
        <div
          className="tapestryDetails"
          onClick={(e) => {
            e.stopPropagation();
            setShown(false);
          }}
        >
          <h3>Details</h3>
          <p>
            <strong>Source: </strong>{" "}
            {item.url ? <a href={item.url}>{item.url}</a> : item.content}
          </p>
        </div>
      ) : null}
    </Fragment>
  );
};

const TapestryItem = ({
  item,
  focused,
  setFocus,
  setFocusElsewhere,
  comments,
  openComments,
  preview,
  hideComments,
}) => {
  const [itemIsFullScreen, setItemIsFullScreen] = useState(false);
  const itemHandle = useFullScreenHandle();
  return (
    <section
      tabIndex={-1}
      id={preview ? `preview_${item.id}` : item.id}
      className={`tapestryItem ${focused ? "focused" : ""} ${
        item.type === "tapestrylink" ? "link" : ""
      } ${item.hideTitle ? "hidetitle" : ""}`}
      style={
        preview
          ? { gridArea: "initial" }
          : {
              gridColumnStart: item.x,
              gridColumnEnd: item.x + item.width,
              gridRowStart: item.y,
              gridRowEnd: item.y + item.height,
            }
      }
      onClick={setFocus}
    >
      <FullScreen handle={itemHandle}>
        {item.type === "tapestrylink" ? null : (
          <a
            href="/#"
            className={`fullscreenicon ${
              item.type === "textFrame" ? "notapestryicon" : ""
            }`}
            onClick={(e) => {
              e.preventDefault();
              console.log(e);
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
        {preview || hideComments ? null : (
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

export default TapestryItem;
