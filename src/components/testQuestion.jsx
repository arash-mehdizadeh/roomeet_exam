import { useState, useEffect } from "react";
import Bar from "./audioPlayer/Bar";
import TestOptions from "./testOptions";

import classes from '../styles/components/testQuestion.module.scss';
// import Audio from './audioPlayer/Audio';

import { ReactComponent as PauseCircleFilled } from '../assets/icons/pause-circle-filled.svg';
import { ReactComponent as PlayCircleFilled } from '../assets/icons/play-circle-filled.svg';

import '../styles/components/audio/audio.scss';
import AudioController from "./audioPlayer/AudioController";
import ImageModal from "./modal/imageModal";




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


const TestQuestion = ({ id, quNo, audioURL, imageURL, score, options, body, isRank }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)


    const musicURL = audioURL;
    // AudioController
    const { playing, toggle, duration, curTime, setClickedTime } = AudioController(musicURL);
    const modalHandler = () => {
        setIsModalOpen(prev => !prev)
    }

    // console.log("duration => " + duration, "curTime => " + curTime);

    return (
        <div className={classes.questionBox} key={id}>
            {
                isModalOpen &&
                <ImageModal onConfirm={modalHandler} imageURL={imageURL} />
            }
            <div className={classes.questionDetail}>
                { isRank ?
                    ""
                    :<>
                        <p>{`سوال ${quNo} :`}</p>
                        <p>{`( ${score} نمره )`}</p>
                    </>
                }
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                {body && <p style={{ wordBreak: "break-word" }}>{body}</p>}
                {imageURL &&
                    <div className={classes.muChImageContainer}>
                        <img onClick={() => modalHandler()} src={imageURL} alt={body} style={{ cursor: "pointer" }} />
                    </div>
                }
                {
                    audioURL && <div className={classes.muChAudioContainer}>
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
                        </>
                    </div>
                }
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