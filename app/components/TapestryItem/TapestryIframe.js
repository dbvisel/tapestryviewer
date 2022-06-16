// Note that tapestry iframes don't have titles
// Should there be a way of making them full-screen that's not here?

const TapestryIframe = ({ url }) => (
  <div className={`notitle frame tapestryframe`}>
    <iframe
      src={`/tapestry/${url}/`}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
      title={url}
    />
  </div>
);

export default TapestryIframe;
