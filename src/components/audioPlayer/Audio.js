import React, { useEffect, useState } from "react";

// import Song from "../../assets/audio/Safe_sound.mp3";
import Voice from "../../assets/audio/audio.ogg";
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";
import '../../styles/components/audio/audio.scss';

import useAudioPlayer from './useAudioPlayer';

function Audio() {
    
    const { curTime, duration, setClickedTime } = useAudioPlayer();
    // console.log(curTime,duration,playing);
    const [playing ,setPlaying] = useState(false);
    useEffect(() => {
    const audio = document.getElementById("audio");
        playing ? audio.play() : audio.pause();
    }, [playing])
    
    return (
    <div className="player">
        <audio id="audio">
            <source src={Voice} />
                Your browser does not support the <code>audio</code> element.
        </audio>
        <div className="controls">
            {playing ? 
                <Pause handleClick={() => setPlaying(false)} /> :
                <Play handleClick={() => setPlaying(true)} />
            }
            <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)}/>
        </div>
    </div>
    );
}

export default Audio;
