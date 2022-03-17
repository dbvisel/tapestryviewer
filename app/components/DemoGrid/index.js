import { getColor } from "~/utils/utils.mjs";

const deNaN = (x) => (isNaN(x) ? 1 : parseInt(x, 10));

const DemoGrid = ({ items, focused, gridGap, gridUnitSize }) =>
  items.length ? (
    <div
      className="demogrid"
      style={{
        "--gridGap": `${gridGap}px`,
        "--gridUnitSize": `${gridUnitSize}px`,
      }}
    >
      {items.map((item, index) => (
        <div
          key={`grid_${index}`}
          className={`demoitem ${
            focused.id && focused.id === item.id ? "focused" : ""
          }`}
          style={{
            gridColumnStart: deNaN(item.x),
            gridColumnEnd: deNaN(item.x) + deNaN(item.width),
            gridRowStart: deNaN(item.y),
            gridRowEnd: deNaN(item.y) + deNaN(item.height),
            backgroundColor: getColor(index),
          }}
        >
          {index + 1}
        </div>
      ))}
    </div>
  ) : null;

export default DemoGrid;
