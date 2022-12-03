import { useState, useEffect } from "react";
import Bar from "./audioPlayer/Bar";
import TestOptions from "./testOptions";

import classes from '../styles/components/testQuestion.module.scss';
// import Audio from './audioPlayer/Audio';

import { ReactComponent as PauseCircleFilled } from '../assets/icons/pause-circle-filled.svg';
import { ReactComponent as PlayCircleFilled } from '../assets/icons/play-circle-filled.svg';

import '../styles/components/audio/audio.scss';
import AudioController from "./audioPlayer/AudioController";




// const useAudio = url => {
//     var audio =new Audio(url);
//     const [playing, setPlaying] = useState(true);

//     const toggle = () => setPlaying(!playing);

//     useEffect(() => {
//         playing ? audio.play() : audio.pause();
//       },
//       [playing]
//     );

//     useEffect(() => {
//       audio.addEventListener('ended', () => setPlaying(false));
//       return () => {
//         audio.removeEventListener('ended', () => setPlaying(false));
//       };
//     }, []);

//     return [playing, toggle];
//   };


const TestQuestion = ({ id, quNo, audioURL, imageURL, score, options, body, data }) => {


    const musicURL = audioURL;
    // AudioController
    const { playing, toggle, duration, curTime, setClickedTime } = AudioController(musicURL);

    // console.log("duration => " + duration, "curTime => " + curTime);

    return (
        <div className={classes.questionBox} key={id}>

            <div className={classes.questionDetail}>
                <p>{`سوال ${quNo} :`}</p>
                <p>{`( ${score} نمره )`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                {body && <p>{body}</p>}
                <div className={classes.muChImageContainer}>
                    {imageURL && <img src={imageURL} alt={body} />}
                    {/* <p>image</p> */}
                </div>
            
                <div className={classes.muChAudioContainer}>
                    
                    {/* <div style={{ display: "flex", alignItems: "center" }}> */}
                        {audioURL &&
                            <>
                                <Bar curTime={curTime} duration={duration} onTimeUpdate={(time) => { setClickedTime(time); console.log(time) }} />
                                {
                                    playing ?

                                        <div className="player__button" style={{ cursor: "pointer" }} onClick={() => toggle()} key={id}>
                                            <PauseCircleFilled style={{ fill: "#c30a7f" }} />
                                        </div> :
                                        <div className="player__button" style={{ cursor: "pointer" }} onClick={() => toggle()} key={id}>
                                            <PlayCircleFilled style={{ fill: "#c30a7f" }} />
                                        </div>
                                }
                            </>}

                    {/* </div> */}
                </div>
                <div className={classes.muChQuestionContainer}>
                    <ul>
                        {
                            options?.map(data => (
                                <TestOptions id={data.id} optionNo={data.option_number} optionBody={data.body} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TestQuestion;