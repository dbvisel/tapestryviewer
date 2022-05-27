import { Fragment, useState } from "react";

const TapestryIcon = ({ item }) => {
  const [shown, setShown] = useState(false);
  return (
    <Fragment>
      <a
        href="/#"
        className={`tapestryIcon ${shown ? "on" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShown(!shown);
        }}
      >
        i
      </a>
      {shown ? (
        <div
          className="tapestryDetails"
          onClick={(e) => {
            e.stopPropagation();
            setShown(false);
          }}
        >
          <h3>Details</h3>
          <p>
            <strong>Source: </strong>{" "}
            {item.url ? <a href={item.url}>{item.url}</a> : item.content}
          </p>
        </div>
      ) : null}
    </Fragment>
  );
};

export default TapestryIcon;
