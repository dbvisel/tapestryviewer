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
  // make sure no items overlap?
  // get tapestry size.

  // console.log(calculateTapestrySize(tapestry.items));

  // console.log(tapestry.items);
  const linksList = makeLinkList(tapestry.items);
  // console.log(linksList);
  const updateXarrow = useXarrow();
  return (
    <Xwrapper>
      <div className="viewport" onScroll={updateXarrow}>
        <article className="tapestryGrid">
          {tapestry.items.length ? (
            tapestry.items.map((item, index) => (
              <TapestryItem key={index} item={item} />
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
    </Xwrapper>
  );
};

export default TapestryComponent;
