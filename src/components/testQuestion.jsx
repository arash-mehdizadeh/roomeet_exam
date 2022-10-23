
import TestOptions from "./testOptions";
import classes from '../styles/components/testQuestion.module.scss';
import Audio from './audioPlayer/Audio';


const TestQuestion = () => {
    
    const optionsData = [{ id: 1, data: "باور کن نمیدونم" }, { id: 2, data: "از من بپرس" }, { id: 3, data: "از این مبحث سوال نمیاد" }, { id: 4, data: "یک یک موارد بالا" }]

    return (
        <div className={classes.questionBox}>
            <div className={classes.questionDetail}>
                <p>{`سوال ${1} :`}</p>
                <p>{`( ${"۰/۲۵"} نمره )`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>با توجه به عکس کدام گزینه درست است؟</p>
                <div className={classes.muChImageContainer}>
                    <img src="https://picsum.photos/id/1070/5472/3648" alt='nigga'/>
                    {/* <p>image</p> */}
                </div>
                <div className={classes.muChAudioContainer}>
                    {/* <ReactAudioPlayer src="http://streaming.tdiradio.com:8000/house.mp3" controls/> */}
                    <Audio />
                </div>
                <div className={classes.muChQuestionContainer}>
                    <ul>
                        {
                            optionsData.map(data => (
                                <TestOptions data={data.data} option={data.id} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TestQuestion;