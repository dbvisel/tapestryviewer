import { Link } from "remix";

const TextFrame = ({ title, content, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame textframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const TapestryFrame = ({ title, link }) => (
  <div className={`frame tapestryframe`}>
    <Link to={`/tapestry/${link}`}>{title}</Link>
  </div>
);

const BookFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""}  frame bookframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameborder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowfullscreen
    />
  </div>
);

const ImageFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame imageframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameborder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowfullscreen
    />
  </div>
);

const VideoFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame videoframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameborder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowfullscreen
    />
  </div>
);

const AudioFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame audioframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <div>
      <iframe
        src={url}
        height={36}
        width={"100%"}
        frameborder="0"
        webkitallowfullscreen="true"
        mozallowfullscreen="true"
        allowfullscreen
      />
    </div>
  </div>
);

const WebFrame = ({ title, url, hideTitle }) => (
  <div className={`${hideTitle ? "notitle" : ""} frame webframe`}>
    {hideTitle ? null : <h2 className="tapestryItemHead">{title}</h2>}
    <iframe
      src={url}
      frameborder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowfullscreen
    />
  </div>
);

const TapestryItem = ({ item, focused, setFocus }) => {
  // console.log(item);
  return (
    <section
      id={item.id}
      className={`tapestryItem ${focused ? "focused" : ""}`}
      style={{
        gridColumnStart: item.x,
        gridColumnEnd: item.x + item.width,
        gridRowStart: item.y,
        gridRowEnd: item.y + item.height,
      }}
      onClick={setFocus}
    >
      {item.type === "textFrame" ? (
        <TextFrame
          title={item.title}
          content={item.content}
          hideTitle={item.hideTitle}
        />
      ) : item.type === "tapestry" ? (
        <TapestryFrame title={item.title} link={item.url} />
      ) : item.type === "book" ? (
        <BookFrame
          title={item.title}
          url={item.url}
          hideTitle={item.hideTitle}
        />
      ) : item.type === "image" ? (
        <ImageFrame
          title={item.title}
          url={item.url}
          hideTitle={item.hideTitle}
        />
      ) : item.type === "audio" ? (
        <AudioFrame
          title={item.title}
          url={item.url}
          hideTitle={item.hideTitle}
        />
      ) : item.type === "video" ? (
        <VideoFrame
          title={item.title}
          url={item.url}
          hideTitle={item.hideTitle}
        />
      ) : item.type === "web" ? (
        <WebFrame
          title={item.title}
          url={item.url}
          hideTitle={item.hideTitle}
        />
      ) : (
        <p>
          Unrecognized item type: {item.title}
          <br />
          {JSON.stringify(item)}
        </p>
      )}
    </section>
  );
};

export default TapestryItem;
