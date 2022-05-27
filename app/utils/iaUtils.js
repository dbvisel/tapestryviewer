export const getPage = (url) => {
  // from IA url, returns page as a number if it exists, otherwise 0
  const pageLoc = url.indexOf("/page/");
  if (pageLoc < 0) return 0;
  const secondHalf = url.split("/page/")[1];
  if (secondHalf.indexOf("/") < 0)
    return parseInt(secondHalf.replace("n", ""), 10);
  return parseInt(secondHalf.split("/")[0].replace("n", ""), 10);
};

export const getMode = (url) => {
  // from IA url, returns mode as "1up" or "2up" if it exists, otherwise "2up"
  const modeLoc = url.indexOf("/mode/");
  if (modeLoc < 0) return "2up";
  const secondHalf = url.split("/mode/")[1];
  if (secondHalf.indexOf("/") < 0) return secondHalf;
  return secondHalf.split("/")[0];
};

export const getBaseUrl = (url) => {
  // from IA url, returns base url without page or mode
  const pageLoc = url.indexOf("/page/");
  const modeLoc = url.indexOf("/mode/");
  if (pageLoc < 0 && modeLoc < 0) return url;
  if (pageLoc < 0) return url.substring(0, modeLoc);
  if (modeLoc < 0) return url.substring(0, pageLoc);
  return url.substring(0, Math.min(pageLoc, modeLoc));
};

export const composeUrl = (baseUrl, page, mode) =>
  mode === "1up" || mode === "2up"
    ? `${baseUrl}/page/n${page || "0"}/mode/${mode || "2up"}`
    : `${baseUrl}/page/n${page || "0"}`;

export const getDownloadUrl = (url, page) => {
  // from IA url, returns download url with page
  const baseUrl = getBaseUrl(url);
  const downloadBaseUrl = baseUrl
    .replace("/detail/", "/download/")
    .replace("/embed/", "/download/");
  return composeUrl(downloadBaseUrl, page);
};
