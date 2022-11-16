import { useEffect, useState } from "react";

const TextFrame = ({
  title,
  content,
  hideTitle,
  titleClick,
  transformerRef,
  isFocused,
}) => {
  const [zoomFactor, setZoomFactor] = useState(1);
  useEffect(() => {
    if (
      isFocused &&
      transformerRef.current?.state?.scale &&
      transformerRef.current.state.scale !== zoomFactor
    ) {
      console.log(
        "Resetting zoom factor: ",
        transformerRef.current.state.scale
      );
      setZoomFactor(transformerRef.current.state.scale);
    }
  }, [isFocused, transformerRef, zoomFactor]);
  return (
    <div className={`${hideTitle ? "notitle" : ""} frame textframe`}>
      {hideTitle ? null : (
        <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
          {title}
        </h2>
      )}
      <div
        style={{ "--zoomFactor": isFocused ? zoomFactor : 1 }}
        dangerouslySetInnerHTML={{ __html: content }}
        onMouseDown={(e) => {
          e.stopPropagation();
        }}
      />
    </div>
  );
};
export default TextFrame;
