import { getColor, deNaN } from "~/utils/utils.mjs";

const DemoGrid = ({ items, focused, gridGap, gridUnitSize, background }) =>
  items.length ? (
    <div
      className="demogrid"
      style={{
        "--gridGap": `${gridGap}px`,
        "--gridUnitSize": `${gridUnitSize}px`,
        background: background,
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
