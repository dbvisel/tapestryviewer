import Xarrow, { useXarrow, Xwrapper } from "react-xarrows";
import TapestryItem from "~/components/TapestryItem";

const calculateTapestrySize = (items) => {
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  for (let i = 0; i < items.length; i++) {
    const thisItem = items[i];
    if (thisItem.x < minX) {
      minX = thisItem.x;
    }
    if (thisItem.y < minY) {
      minY = thisItem.y;
    }
    if (thisItem.x + thisItem.width > maxX) {
      maxX = thisItem.x + thisItem.width;
    }
    if (thisItem.y + thisItem.height > maxY) {
      maxY = thisItem.y + thisItem.height;
    }
  }
  return { minX, minY, maxX, maxY };
};

const makeLinkList = (items) => {
  const linksList = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].linksTo.length) {
      for (let j = 0; j < items[i].linksTo.length; j++) {
        const linkTo = items[i].linksTo[j];
        const linkFrom = items[i].id;
        const link = {
          from: linkFrom,
          to: linkTo,
        };
        linksList.push(link);
      }
    }
  }
  return linksList;
};

const TapestryComponent = ({ tapestry }) => {
  const [focused, setFocused] = React.useState(-1);
  // console.log(tapestry);
  // make sure no items overlap?
  // get tapestry size.

  // console.log(calculateTapestrySize(tapestry.items));

  // console.log(tapestry.items);
  const linksList = makeLinkList(tapestry.items);
  // console.log(linksList);
  const updateXarrow = useXarrow();

  const keyDownHandler = (event) => {
    if (focused > -1) {
      if (event.code === "ArrowUp" || event.code === "ArrowLeft") {
        console.log("left");
      }

      if (event.code === "ArrowDown" || event.code === "ArrowRight") {
        if (
          tapestry.items[focused].linksTo &&
          tapestry.items[focused].linksTo.length
        ) {
          const nextId = tapestry.items[focused].linksTo[0];
          const nextItem = tapestry.items.find((item) => item.id === nextId);
          const nextItemIndex = tapestry.items.indexOf(nextItem);
          setFocused(nextItemIndex);
        }
      }
    }
  };
  return (
    <Xwrapper>
      <div
        className="viewport"
        style={{ background: tapestry.background, backgroundSize: "cover" }} // "cover" isn't firing sometimes!
        tabIndex={0}
        onKeyDown={keyDownHandler}
        onClick={(e) => {
          e.stopPropagation();
          setFocused(-1);
        }}
      >
        <div className="scroller" onScroll={updateXarrow}>
          <article className="tapestryGrid">
            {tapestry.items.length ? (
              tapestry.items.map((item, index) => (
                <TapestryItem
                  key={index}
                  item={item}
                  focused={focused === index}
                  setFocus={(e) => {
                    e.stopPropagation();
                    setFocused(index);
                  }}
                />
              ))
            ) : (
              <p>(No items on this tapestry.)</p>
            )}
            {linksList.map((link, index) => (
              <Xarrow
                key={index}
                start={link.from} //can be react ref
                end={link.to} //or an id
                curveness={0.5}
              />
            ))}
          </article>
        </div>
      </div>
    </Xwrapper>
  );
};

export default TapestryComponent;
