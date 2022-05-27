// this figures out the tapestry size in grid units

export const calculateTapestrySize = (items) => {
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

// this parses tapestry links to figure out what they're actually linked to

export const makeLinkList = (items) => {
  const linksList = [];
  for (let i = 0; i < items.length; i++) {
    if (items[i].linksTo && items[i].linksTo.length) {
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

// this figures out the transformation that's actually applied by the zoom.
// returns x offset, y offset, zoom
export const getTransformSetting = (transformedStyle) => {
  const transforms = transformedStyle
    .split("translate3d(")[1]
    .split(")")[0]
    .split("px, ")
    .map((x) => parseFloat(x));
  const zoom = Number(transformedStyle.split("scale(")[1].split(")")[0]);
  return [transforms[0], transforms[1], zoom];
};
