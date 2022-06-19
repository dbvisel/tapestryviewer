import ReactAudioPlayer from "react-audio-player";
import { useState } from "react";

const AudioControllerFrame = ({
  title,
  url,
  hideTitle,
  controlList,
  setFocus,
  titleClick,
}) => {
  const [currentId, setCurrentId] = useState("");
  const sortedControlList = controlList.sort((a, b) => {
    if (a.time > b.time) return 1;
    if (a.time < b.time) return -1;
    return 0;
  });
  // console.log("Going to: ", currentId);
  return (
    <div className={`${hideTitle ? "notitle" : ""} frame audioframe`}>
      {hideTitle ? null : (
        <h2 className="tapestryItemHead" onDoubleClick={titleClick}>
          {title}
        </h2>
      )}
      <div>
        <ReactAudioPlayer
          src={url}
          crossOrigin={"true"}
          controls
          listenInterval={500}
          onListen={(e) => {
            const currentTime = e * 1000;

            if (currentTime < sortedControlList[0].time) return;

            for (
              let i = sortedControlList.length - 1;
              i < sortedControlList.length;
              i--
            ) {
              if (currentTime > sortedControlList[i].time) {
                setCurrentId(sortedControlList[i].id);
                setFocus(sortedControlList[i].id);
                break;
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default AudioControllerFrame;
