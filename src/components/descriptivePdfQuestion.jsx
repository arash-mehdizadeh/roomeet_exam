
import classes from '../styles/components/testQuestion.module.scss';
import Audio from './audioPlayer/Audio';
import SampleImage from '../assets/images/examPic.png';

const DescriptivePdfQuestion = () => {
    

    return (
        <div className={classes.questionBox}>
            <div className={classes.questionDetail}>
                <p>{`سوال ${1} :`}</p>
                <p>{`( ${"۰/۲۵"} نمره )`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>با توجه به عکس کدام گزینه درست است؟</p>
                <div className={classes.muChImageContainer}>
                    <img src={SampleImage} alt='nigga'/>
                    {/* <p>image</p> */}
                </div>
                <div className={classes.muChAudioContainer} style={{border:"unset"}}>
                    {/* <ReactAudioPlayer src="http://streaming.tdiradio.com:8000/house.mp3" controls/> */}
                    <Audio />
                </div>
            </div>
        </div>
    )
}

export default DescriptivePdfQuestion;