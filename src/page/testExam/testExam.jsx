import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { attemptToJoinExam } from "../../assets/api/userActions";
import CountDown from "../../components/countDown/countDown";

import TestAnswerOptions from '../../components/testAnswerOptions';
import TestQuestion from '../../components/testQuestion';

import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from '../../App.module.scss';

function TestExam() {
    const navigate = useNavigate();
    const params = useParams();

    const [examData, setExamData] = useState();
    const [examDataAttemptID, setExamDataAttemptID] = useState();
    
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);
    
    const fetchData = async () => {
        const data = await attemptToJoinExam(params.quiz)
        // console.log(data.quiz);
        setExamData(data)
        setExamDataAttemptID(data.attempt.id);
        setTimeLeft(data.quiz.duration)
        setTotalTime(data.quiz.duration)

    }

    useEffect(() => {
        fetchData();
        return () => {
            setIsLoading(false)
        }
    }, [])


    return (
        <div className={classes.appContainer}>
            {
                !isLoading ?

                    examData && <div className={classes.container}>
                        <header className={classes.timeRemainedContainer} style={{ display: 'grid' }}>
                            <div className={classes.headerBox}>
                                <div className={classes.buttonContainer}>
                                    <p>اتمام آزمون</p>
                                    <p  >ترک آزمون</p>
                                </div>
                                <CountDown totalTime={totalTime} timeRemained={timeLeft} />
                            </div>
                            <div className={classes.informationBar}>
                                <div className={classes.examDetails}>
                                    <div className={classes.examDetailsTitle}>
                                        <h1>{examData.quiz.title}</h1>
                                        <p>{`(آموزشگاه فراگویان)`}</p>
                                    </div>
                                    <div id={classes.returnBtn}>
                                        <p>بازگشت به سایت</p>
                                        <div className={classes.exitIcon}>
                                            <Exit fill='#fff' width="15px" height='15px' />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.personalDetails}>
                                    <ul>
                                        <li>{`نام کاربر : ${"فردوسی"}`}</li>
                                        <li>{`مدت آزمون : ${examData.quiz.duration / 60} دقیقه`}</li>
                                        <li>{`نوع آزمون : ${examData.quiz.type === "test" ? "تستی" : "تشریحی"}`}</li>
                                        <li>{`ضریب منفی : ${examData.quiz.negative_point === "3/1" ? "۳ به ۱" : "ندارد"}`}</li>
                                        <li>{`تعداد سوالات : ${examData.quiz.number_of_question}`}</li>
                                    </ul>
                                </div>
                            </div>
                        </header>

                        <main className={classes.mainContainer}>
                            <div className={classes.answerSheetContainer}>
                                <div className={classes.answerSheetHeader}>
                                    <h3>پاسخنامه</h3>
                                    <div className={classes.answerDatasheet}>
                                        <p className={classes.answerDatasheet_answer}>{`پاسخ داده شده : ${examData.attempt.answered_questions}`}</p>
                                        <p className={classes.answerDatasheet_notAnswer}>{`پاسخ داده نشده : ${examData.attempt.unanswered_questions}`}</p>
                                    </div>
                                </div>
                                <div className={classes.answerSheet}>
                                    <ol>
                                        {
                                            examData.quiz?.questions?.map((data) => (
                                                <TestAnswerOptions id={data.id} attemptID={examDataAttemptID} options={data.options} score={data.score} />
                                            ))
                                        }
                                        {/* <TestAnswerOptions  />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions />
                                        <TestAnswerOptions /> */}
                                    </ol>
                                </div>
                            </div>
                            {/* DISPLAY QUESTION / QUESTION SECTION  */}
                            <section className={classes.questionSection}>
                                <div className={classes.questionSection_header}>
                                    <h2>سوالات آزمون</h2>
                                    <div className={classes.reloadBtn}>
                                        <p>بارگذاری مجدد</p>
                                        <div id={classes.refreshIcon}>
                                            <Refresh />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.questionContainer}>
                                    {
                                        examData.quiz?.questions?.map((data) => (
                                            <TestQuestion data={data} id={data.id} options={data.options} quNo={data.question_number}
                                                body={data.body} score={data.score} imageURL={data.image} audioURL={data?.voice}
                                            />
                                        ))
                                    }

                                </div>
                            </section>
                        </main>

                    </div> : <p>not loaded</p>}
        </div>
    );
}

export default TestExam;
