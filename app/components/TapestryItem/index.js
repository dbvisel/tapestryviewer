import { Link } from "remix";

const TextFrame = ({ title, content }) => (
  <div className="textframe">
    <h2 className="tapestryItemHead">{title}</h2>
    <div dangerouslySetInnerHTML={{ __html: content }} />
  </div>
);

const TapestryFrame = ({ title, link }) => (
  <div className="tapestryframe">
    <Link to={`/tapestry/${link}`}>{title}</Link>
  </div>
);

const TapestryItem = ({ item }) => {
  console.log(item);
  return (
    <section
      className="tapestryItem"
      style={{
        gridColumnStart: item.x,
        gridColumnEnd: item.x + item.width,
        gridRowStart: item.y,
        gridRowEnd: item.y + item.height,
      }}
    >
      {item.type === "textFrame" ? (
        <TextFrame title={item.title} content={item.content} />
      ) : item.type === "tapestry" ? (
        <TapestryFrame title={item.title} link={item.url} />
      ) : (
        item.title
      )}
    </section>
  );
};

export default TapestryItem;
