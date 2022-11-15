
import TestOptions from "./testOptions";
import classes from '../styles/components/testQuestion.module.scss';
import Audio from './audioPlayer/Audio';
import SampleImage from '../assets/images/examPic.png';

import { Howl } from "howler"
import { useEffect } from "react";
import { useState } from "react";

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
    // const [playing, toggle] = useAudio('https://quiz-api.roomeet.ir/upload/files/mp3/2022/11/ftp_1668522900_2022-11-16T02-08-06.160Z__file_example_MP3_1MG.mp3');

    const [isPlay, setIsPlay] = useState(false)
    
    const sound = new Howl({
        src: [audioURL],
        html5: true
    })
    const onPlay = () =>{
        sound.play()
    }
    const onPause = () =>{
        sound.pause()
    }
    // sound.play()
    useEffect(() => {

    }, [])


    // const toggleAudio = (player) =>{
    //     player ? sound.play() : sound.pause(); 
    // }

    const audioClip = [
        { sound: audioURL, id: 1, label: "nigga" }
    ]
    // const renderButtonSound = () => {
    //     return audioClip.map((soundObj, index) => (
    //         <>
    //         <button key={index} onClick={() => toggleAudio(true)}>{soundObj.label}</button>
    //         <button onClick={()=>toggleAudio(false)} >stop</button>
    //         </>
    //     )
    //     )
    // }

    // const optionsData = [{ id: 1, data: "باور کن نمیدونم" }, { id: 2, data: "از من بپرس" }, { id: 3, data: "از این مبحث سوال نمیاد" }, { id: 4, data: "یک یک موارد بالا" }]
    return (
        <div className={classes.questionBox} key={id}>

            <div className={classes.questionDetail}>
                <p>{`سوال ${quNo} :`}</p>
                <p>{`( ${score} نمره )`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>{body}</p>
                <div className={classes.muChImageContainer}>
                    <img src={imageURL} alt={body} />
                    {/* <p>image</p> */}
                </div>
                <div className={classes.muChAudioContainer}>
                    {/* <ReactAudioPlayer src="http://streaming.tdiradio.com:8000/house.mp3" controls/> */}
                    {/* {renderButtonSound()} */}
                    <button onClick={()=>onPlay()}>play</button>
                    <button onClick={()=>onPause()}>pause</button>
                    {/* {audioURL && <Audio audioURL={audioURL} audioID={quNo} />} */}
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