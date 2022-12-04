import { useState, useEffect } from 'react';
import { postUserTestAnswer, testAnswerCancel } from '../assets/api/userActions';
import { ReactComponent as Cancel } from '../assets/icons/cancel.svg';

import classes from '../styles/components/TestAnswerOptions.module.scss'

const TestAnswerOptions = ({ id, attemptID, options, score, userAnswered, answerResHandler, examDataAttempt }) => {

    const [activeBtn, setActiveBtn] = useState(0)
    const [createdAnswerID, setCreatedAnswerID] = useState(0)

    const userAnsweredHandler = (qid) => {
        for (var i = 0; i < examDataAttempt?.answers?.length; i++) {
            if (qid === examDataAttempt?.answers[i].question_id) {
                setActiveBtn(examDataAttempt.answers[i].option_id);
                setCreatedAnswerID(examDataAttempt?.answers[i]?.id)
            }
        }
    }

    useEffect(() => {
        userAnsweredHandler(id)
    }, [])
    const postAnswerDataHandler = (optionNum) => {
        // e.preventDefault();
        // console.log("id =>" +id,"attempID =>" +attemptID , "ActiveBtn => " + optionNum );
        postUserTestAnswer(id, attemptID, optionNum).then(res => { answerResHandler(res.data.attempt); setCreatedAnswerID(res.data.created_answer.id); })
    }


    const onDeleteOptionHandler = async () => {
        if (createdAnswerID !== 0) {
            setActiveBtn(0);
            // console.log(createdAnswerID)
            await testAnswerCancel(createdAnswerID).then(res => {  console.log(res);;answerResHandler(res.data.attempt)})
        }
        else {
            return;
        }
    }

    const onOptionClickHandler = (num) => {
        setActiveBtn(num);
        postAnswerDataHandler(num)
    }

    return (
        <li key={id} >
            <div className={classes.testRow}>
                <div className={classes.testOptionsContainer}>

                    {
                        options?.map((el) => {
                            // console.log(el);
                            return <div key={el.id} onClick={() => onOptionClickHandler(el.option_number)}
                                className={`${classes.testOptionButton}  ${activeBtn === el.option_number ? classes.active_btn : ""}`}>
                                {el.option_number}
                            </div>
                        })
                    }
                </div>
                <div className={classes.cancelContainer}>
                    <Cancel style={{ cursor: "pointer" }} onClick={() => onDeleteOptionHandler()} />
                </div>
                <div className={classes.grade}>
                    <div>{score}</div>
                    <div >بارم</div>
                </div>
            </div>
        </li>
    )
}

export default TestAnswerOptions;