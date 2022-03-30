export const slugify = (text, separator = "-") => {
  return text
    .toString()
    .normalize("NFD") // split an accented letter in the base letter and the acent
    .replace(/[\u0300-\u036f]/g, "") // remove all previously split accents
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, "") // remove all chars not letters, numbers and spaces (to be replaced)
    .trim()
    .replace(/\s+/g, separator);
};

export const cleanDate = (date) => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour12: true,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  });
};

export const publicationStatus = (pubStatus) => {
  const statuses = {
    published: "Public",
    private: "Private",
    publicWithLink: "Public with link",
  };
  return statuses[pubStatus];
};

export const hashString = (m) => {
  let hash = 0;
  for (let i = 0; i < m.length; i++) {
    const character = m.charCodeAt(i);
    hash = (hash << 5) - hash + character;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

const colors = [
  "#ff0000",
  "#ff7f00",
  "#ffff00",
  "#00ff00",
  "#00ffff",
  "#0000ff",
  "#7f00ff",
  "#ff00ff",
];

export const getColor = (x) => colors[x % colors.length];

export const secondsToTime = (e) => {
  var h = Math.floor(e / 3600)
      .toString()
      .padStart(2, "0"),
    m = Math.floor((e % 3600) / 60)
      .toString()
      .padStart(2, "0"),
    s = Math.floor(e % 60)
      .toString()
      .padStart(2, "0");

  return h + ":" + m + ":" + s;
  //return `${h}:${m}:${s}`;
};
