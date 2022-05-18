const TextFrame = ({ title, content, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame textframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div
      dangerouslySetInnerHTML={{ __html: content }}
      onMouseDown={(e) => {
        e.stopPropagation();
      }}
    />
  </div>
);

export default TextFrame;
