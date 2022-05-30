import throbber from "./images/Loading_icon_cropped.gif";

const WebFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame webframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div>
      <img src={throbber} alt="Loading..." />
    </div>
    <iframe
      src={url}
      title={title}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

export default WebFrame;
