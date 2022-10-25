import Audio from './audioPlayer/Audio';

import SampleImage from '../assets/images/examPic.png';

import classes from '../styles/components/testQuestion.module.scss';


const HomeworkQuestion = () => {


    return (
        <div className={classes.questionBox}>
            <div className={classes.questionDetail}>
                <p>{`سوال ${1} :`}</p>
                <p>{`( نمره${"۰/۲۵"})`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>معادله زیر را بدست آورید؟</p>
                <div className={classes.muChImageContainer}>
                    <img src={SampleImage} alt='nigga'/>
                </div>
                <div className={classes.homeworkAudioContainer}>
                    <Audio />
                </div>
                <div className={classes.homeworkPdfContainer}>
                    pdf viewer going show here
                </div>
            </div>
        </div>
    )
}

export default HomeworkQuestion;