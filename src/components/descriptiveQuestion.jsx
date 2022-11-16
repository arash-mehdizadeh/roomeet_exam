
import classes from '../styles/components/testQuestion.module.scss';
import Audio from './audioPlayer/Audio';
import SampleImage from '../assets/images/examPic.png';

const DescriptiveQuestion = ({ id, quNo, audioURL, imageURL, score, options, body, data }) => {


    return (
        <div className={classes.questionBox} key={id}>
            <div className={classes.questionDetail}>
                <p>{`سوال ${quNo} :`}</p>
                <p>{`( ${score} نمره )`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>با توجه به عکس کدام گزینه درست است؟</p>
                <div className={classes.muChImageContainer}>
                    <img src={imageURL} alt={body} />
                    {/* <p>image</p> */}
                </div>
                <div className={classes.muChAudioContainer} style={{ border: "unset" }}>
                    {/* <ReactAudioPlayer src="http://streaming.tdiradio.com:8000/house.mp3" controls/> */}
                    <Audio />
                </div>
            </div>
        </div>
    )
}

export default DescriptiveQuestion;