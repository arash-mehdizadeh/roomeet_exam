import Audio from './audioPlayer/Audio';


import classes from '../styles/components/testQuestion.module.scss';


const HomeworkQuestion = () => {


    return (
        <div className={classes.questionBox}>
            <div className={classes.questionDetail}>
                <p>{`سوال ${1} :`}</p>
                <p>{`( نمره${"۰/۲۵"})`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>با توجه به عکس کدام گزینه درست است؟</p>
                <div className={classes.muChImageContainer}>
                    <img src="https://picsum.photos/id/1070/5472/3648" alt='nigga'/>
                </div>
                <div className={classes.homeworkAudioContainer}>
                    <Audio />
                </div>
                <div className={classes.homeworkPdfContainer}>
                    pdf
                </div>
            </div>
        </div>
    )
}

export default HomeworkQuestion;