const AudioFrame = ({ title, url, hideTitle, titleClick }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame audioframe`}>
    {hideTitle ? null : (
      <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
        {title}
      </h2>
    )}
    <div>
      <iframe
        src={url}
        title={title}
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

export default AudioFrame;
