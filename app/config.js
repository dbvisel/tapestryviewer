const Config = {
  useComments: false,
  zoomingMode: true,
  zoomWholeTapestry: true,
  hideThumbnail: false,
  useShareIcon: false, // if this is true, there's a share icon in lower right
  baseUrl: "https://tapestryviewer.netlify.app", // basic url, no trailing slash
  useTapestrySelector: false,
  usePanButtons: false, // if this is false, we hide the buttons
  titleBarSelectsItem: true,
  useHelpButton: true, // if this is false, we hide the button
  useComponentZoom: true, // if this is true, use the react-pan-pinch-zoom zoom rather than the my panning function
};

export default Config;
