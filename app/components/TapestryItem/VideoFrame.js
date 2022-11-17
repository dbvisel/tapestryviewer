import { useState } from "react";
import Config from "~/config";
const { hideThumbnail } = Config;

const VideoFrame = ({ title, url, thumbnail, hideTitle, titleClick }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div
      className={`${hideTitle ? "notitle" : ""} frame videoframe`}
      onClick={() => {
        setClicked(true);
      }}
    >
      {hideTitle ? null : (
        <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
          {title}
        </h2>
      )}
      {clicked || !thumbnail || hideThumbnail ? (
        <iframe
          src={url}
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
          loading="lazy"
          title={title}
        />
      ) : (
        <img src={thumbnail} alt={title} className="thumbnail" />
      )}
    </div>
  );
};

export default VideoFrame;
