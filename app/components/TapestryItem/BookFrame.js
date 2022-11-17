import { useState } from "react";
// import Config from "~/config";
// const { hideThumbnail } = Config;
const hideThumbnail = true;

const BookFrame = ({ title, url, thumbnail, hideTitle, titleClick }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <div className={`${hideTitle ? "notitle" : ""}  frame bookframe`}>
      {hideTitle ? null : (
        <h2
          className="tapestryItemHead"
          onClick={(e) => {
            e.stopPropagation();
          }}
          onDoubleClick={titleClick}
        >
          {title}
        </h2>
      )}
      {clicked || !thumbnail || hideThumbnail ? (
        <iframe
          src={url}
          title={title}
          frameBorder="0"
          webkitallowfullscreen="true"
          mozallowfullscreen="true"
          allowFullScreen
          loading="lazy"
        />
      ) : (
        <img
          src={thumbnail}
          alt={title}
          className="thumbnail"
          onClick={() => setClicked(true)}
        />
      )}
    </div>
  );
};

export default BookFrame;
