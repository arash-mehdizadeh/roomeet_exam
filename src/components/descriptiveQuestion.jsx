
import classes from '../styles/components/testQuestion.module.scss';
import AudioController from './audioPlayer/AudioController';
import Bar from './audioPlayer/Bar';

import { ReactComponent as PauseCircleFilled } from '../assets/icons/pause-circle-filled.svg';
import { ReactComponent as PlayCircleFilled } from '../assets/icons/play-circle-filled.svg';
import { useState } from 'react';
import ImageModal from './modal/imageModal';


const DescriptiveQuestion = ({ id, quNo, audioURL, imageURL, score, options, body, data }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const modalHandler = () => {
        setIsModalOpen(prev => !prev)
    }
    const musicURL = audioURL;
    const { playing, toggle, duration, curTime, setClickedTime } = AudioController(musicURL);



    return (
        <div className={classes.questionBox} key={id}>
            {
                isModalOpen &&
                <ImageModal onConfirm={modalHandler} imageURL={imageURL} />
            }
            <div className={classes.questionDetail}>
                <p>{`سوال ${quNo} :`}</p>
                <p>{`( ${score} نمره )`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>{body}</p>
                {imageURL &&
                    <div className={classes.muChImageContainer}>
                        <img onClick={() => modalHandler()} src={imageURL} alt={body} style={{ cursor: "pointer" }} />
                    </div>
                }
                <div className={classes.muChAudioContainer} style={{ border: "unset" }}>
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
                </div>
            </div>
        </div>
    )
}

export default DescriptiveQuestion;