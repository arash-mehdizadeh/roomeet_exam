// import React, { useEffect, useState } from "react";
// // import { Howl } from "howler"


// // import Song from "../../assets/audio/Safe_sound.mp3";
// import Voice from "../../assets/audio/audio.ogg";
// import Play from "./Play";
// import Pause from "./Pause";
// import Bar from "./Bar";
// import '../../styles/components/audio/audio.scss';

// import useAudioPlayer from './useAudioPlayer';

// function Audio({ audioURL ,audioID }) {

//     const { curTime, duration, setClickedTime } = useAudioPlayer();
//     // console.log(curTime,duration,playing);
//     const [playing ,setPlaying] = useState(false);
//     useEffect(() => {
//     const audio = document.getElementById("audio");
//         playing ? audio.play() : audio.pause();
//     }, [playing])


//     // const soundPlay = (src) => {
//     //     const second = new Howl({
//     //         src,
//     //         html5: true
//     //     })
//     //     second.play()
//     // }

//     return (
//     <div className="player" key={audioID} >
//         <audio id="audio">
//             <source src={audioID} type="audio/mpeg"/>
//                 Your browser does not support the <code>audio</code> element.
//         </audio>
//         <div className="controls">
//             {playing ? 
//                 <Pause handleClick={() => setPlaying(false)} /> :
//                 <Play handleClick={() => setPlaying(true)} />
//             }
//             <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => setClickedTime(time)}/>
//         </div>
//     </div>
//     );
// }

// export default Audio;

import React, { useEffect, useState } from 'react'

const AudioController = (url) => {

    const [audio, setAudio] = useState(new Audio(url));
    const [playing, setPlaying] = useState(false);
    const [duration, setDuration] = useState();
    const [curTime, setCurTime] = useState();
    const [clickedTime, setClickedTime] = useState();

    const toggle = () => setPlaying(!playing);

    useEffect(() => {
        playing ? audio.play() : audio.pause();
        const setAudioData = () => {
            setDuration(audio.duration);
            setCurTime(audio.currentTime);
        }
        const setAudioTime = () => setCurTime(audio.currentTime);
        audio.addEventListener("loadeddata", setAudioData);
        audio.addEventListener("timeupdate", setAudioTime);
        if (clickedTime && clickedTime !== curTime) {
            audio.currentTime = clickedTime;
            setClickedTime(null);
        }

        audio.addEventListener('ended', () => setPlaying(false));
        audio.addEventListener('loadedmetadata', (e) => {
            // console.log(e.target.duration);
        });

        return () => {
            audio.removeEventListener('ended', () => setPlaying(false));
            audio.removeEventListener("loadeddata", setAudioData);
            audio.removeEventListener("timeupdate", setAudioTime);
        };
    });
    return { playing , toggle, duration, curTime, setClickedTime };
}

export default AudioController