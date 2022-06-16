const BookImageFrame = ({ title, thumbnail, hideTitle, titleClick }) => {
  // console.log(url, thumbnail);
  return (
    <div className={`${hideTitle ? "notitle" : ""}  frame bookframe`}>
      {hideTitle ? null : (
        <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
          {title}
        </h2>
      )}
      <img src={thumbnail} className="thumbnail" alt={title} />
    </div>
  );
};

export default BookImageFrame;
