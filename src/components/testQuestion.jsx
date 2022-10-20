import TestOptions from "./testOptions";
import classes from '../styles/components/testQuestion.module.scss';


const TestQuestion = () => {

    const optionsData = [{ id: 1, data: "باور کن نمیدونم`" }, { id: 2, data: "از من بپرس" }, { id: 3, data: "از این مبحث سوال نمیاد`" }, { id: 4, data: "یک یک موارد بالا" }]

    return (
        <div className={classes.questionBox}>
            <div className={classes.questionDetail}>
                <p>{`سوال ${1} :`}</p>
                <p>{`( نمره${"۰/۲۵"})`}</p>
            </div>
            <div className={classes.scrollableQuestionsContainer}>
                <p>با توجه به عکس کدام گزینه درست است؟</p>
                <div className={classes.muChImageContainer}>
                    {/* <img src/> */}
                    <p>image</p>
                </div>
                <div className={classes.muChAudioContainer}>
                    voice
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