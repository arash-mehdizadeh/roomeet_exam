import React from "react";
import moment from "moment";
import '../../styles/components/audio/audio.scss';
import momentDurationFormatSetup from "moment-duration-format";


export default function Bar(props) {
  const { duration, curTime, onTimeUpdate } = props;

    let curPercentage = curTime / duration * 100;
    // console.log(curPercentage,duration,curPercentage);
    // console.log(curPercentage/duration);

    function formatDuration(duration) {
        return moment
          .duration(duration, "seconds")
          .format("mm:ss", { trim: false });
      }

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    console.log("clickPositionInPage",clickPositionInPage);
    // console.log();
    const bar = document.querySelector(".bar__progress");
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    console.log("barStart",barStart);
    const barWidth = bar.offsetWidth;
    console.log("barWidth",barWidth);
    const clickPositionInBar = clickPositionInPage - barStart;
    console.log("clickPositionInBar",clickPositionInBar);
    const timePerPixel = duration / barWidth;
    console.log("timePerPixel",timePerPixel);
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = eMove => {
      onTimeUpdate(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  return (
    <div className="bar">
        <div className="bar__progress"
            style={{
                background: `linear-gradient(to right, #c30a7f ${curPercentage}%, #CCCCCC 0)`
            }}
            onMouseDown={e => handleTimeDrag(e)}
            >
            <span
                className="bar__progress__knob"
                style={{ left: `${curPercentage - 98}%` }}
            />
        </div>
        <div className="bar__time_container">
            <span className="bar__time">{formatDuration(curTime)}</span>
            <span className="bar__time">{formatDuration(duration)}</span>
        </div>
    </div>
);
}