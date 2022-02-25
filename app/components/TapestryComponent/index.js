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

const TapestryComponent = ({ tapestry }) => {
  // make sure no items overlap?
  // get tapestry size.

  console.log(calculateTapestrySize(tapestry.items));

  console.log(tapestry);
  return (
    <div className="viewport">
      <article className="tapestryGrid">
        {tapestry.items.length ? (
          tapestry.items.map((item, index) => (
            <TapestryItem key={index} item={item} />
          ))
        ) : (
          <p>(No items on this tapestry.)</p>
        )}
      </article>
    </div>
  );
};

export default TapestryComponent;
