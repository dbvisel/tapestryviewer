const BookImageFrame = ({ title, thumbnail, hideTitle }) => {
  // console.log(url, thumbnail);
  return (
    <div className={`${hideTitle ? "notitle" : ""}  frame bookframe`}>
      {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
      <img src={thumbnail} className="thumbnail" alt={title} />
    </div>
  );
};

export default BookImageFrame;
