import { useState } from "react";
import Config from "~/config";
const { hideThumbnail } = Config;

const BookFrame = ({ title, url, thumbnail, hideTitle }) => {
  const [clicked, setClicked] = useState(false);
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

export default BookFrame;
