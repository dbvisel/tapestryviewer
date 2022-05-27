const TapestryTools = ({
  focused,
  isFullScreen,
  setFullScreen,
  commentShown,
  goPrev,
  goNext,
  zoomIn,
  zoomOut,
  resetTransform,
}) => {
  return (
    <div
      className="tools"
      style={{
        transform: `translateX(${
          commentShown ? "calc(0px - var(--commentWidth))" : "0px"
        })`,
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          setFullScreen(!isFullScreen);
        }}
      >
        {isFullScreen ? "↙" : "↗"}
      </button>
      {focused === -1 ? null : (
        <Fragment>
          <button
            className={focused === -1 ? "disabled" : ""}
            disabled={focused === -1}
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
          >
            ←
          </button>
          <button
            className={focused === -1 ? "disabled" : ""}
            disabled={focused === -1}
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
          >
            →
          </button>
        </Fragment>
      )}
      <button
        onClick={(e) => {
          e.stopPropagation();
          zoomIn();
        }}
      >
        +
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          zoomOut();
        }}
      >
        -
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          resetTransform();
        }}
      >
        Reset
      </button>
    </div>
  );
};

export default TapestryTools;
