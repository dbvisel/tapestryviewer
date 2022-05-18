import { Link } from "remix";

const TapestryLinkFrame = ({ title, link }) => (
  <div
    className={`frame tapestrylinkframe`}
    // onClick={() => {
    //   console.log("clicked!");
    // }}
  >
    <Link to={`/tapestry/${link}`} tabIndex={-1}>
      {title}
    </Link>
  </div>
);

export default TapestryLinkFrame;
