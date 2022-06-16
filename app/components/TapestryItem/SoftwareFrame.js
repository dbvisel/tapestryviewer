const SoftwareFrame = ({ title, url, hideTitle, titleClick }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame videoframe`}>
    {hideTitle ? null : (
      <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
        {title}
      </h2>
    )}
    <iframe
      src={url}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
      title={title}
    />
  </div>
);

export default SoftwareFrame;
