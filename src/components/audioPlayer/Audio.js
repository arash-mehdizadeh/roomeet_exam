import React, { useEffect, useState } from "react";
import { Howl } from "howler"


// import Song from "../../assets/audio/Safe_sound.mp3";
import Voice from "../../assets/audio/audio.ogg";
import Play from "./Play";
import Pause from "./Pause";
import Bar from "./Bar";
import '../../styles/components/audio/audio.scss';

import useAudioPlayer from './useAudioPlayer';

function Audio({ audioURL ,audioID }) {
    
    const { curTime, duration, setClickedTime } = useAudioPlayer();
    // console.log(curTime,duration,playing);
    const [playing ,setPlaying] = useState(false);
    useEffect(() => {
    const audio = document.getElementById("audio");
        playing ? audio.play() : audio.pause();
    }, [playing])
    

    const soundPlay = (src) => {
        const second = new Howl({
            src,
            html5: true
        })
        second.play()
    }

    return (
    <div className="player" key={audioID} >
        <audio id="audio">
            <source src={audioID} type="audio/mpeg"/>
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
