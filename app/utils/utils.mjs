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