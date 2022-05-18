const TapestryIframe = ({ url }) => (
  <div className={`notitle frame tapestryframe`}>
    <iframe
      src={`/tapestry/${url}/`}
      frameBorder="0"
      webkitallowfullscreen="true"
      mozallowfullscreen="true"
      allowFullScreen
      loading="lazy"
    />
  </div>
);

export default TapestryIframe;
