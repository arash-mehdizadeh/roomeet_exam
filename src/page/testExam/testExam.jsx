import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { attemptToJoinExam, finishExam } from "../../assets/api/userActions";
import CountDown from "../../components/countDown/countDown";
import TestAnswerOptions from '../../components/testAnswerOptions';
import TestQuestion from '../../components/testQuestion';

import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from '../../App.module.scss';
import { checkMatchQuestion } from "../../assets/utils/utils";

function TestExam() {
    const navigate = useNavigate();
    const params = useParams();

    const [examData, setExamData] = useState();
    const [examDataAttempt, setExamDataAttempt] = useState([]);
    const [userAnswered, setUserAnswered] = useState()
    const [isLoading, setIsLoading] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);


    // const checkMatchQuestion = (dataQue, dataAtt) => {
    //     let matches = [];
    //     // console.log(dataQue ,dataAtt);
    //     for (var i = 0; i < dataQue.questions.length; i++) {
    //         for (var j = 0; j < dataAtt.answers.length; j++) {
    //             if (dataQue.questions[i].id === dataAtt.answers[j].question_id) {
    //                 matches.push({
    //                     id: dataQue.questions[i].id,
    //                     option_number: dataAtt.answers[j].option_id
    //                 })
    //                 // console.log(dataQue.questions[i].id);
    //                 // console.log(dataAtt.answers[j].question_id);
    //                 // matches.push(dataQue.questions[i].id);
    //             }
    //         }
    //     }
    //     setUserAnswered(matches);
    // }
    function isInThePast(date) {
        const today = new Date();
        return date < today;
    }

    function toLoginPage() {
        localStorage.removeItem('userToken');
        navigate(`/quiz/join/${params.quiz}`)
    }

    const LSdata = JSON.parse(localStorage.getItem('userToken'));
    useEffect(() => {
        if (!LSdata) {
            navigate(`/quiz/join/${params.quiz}`)
        }
        if (LSdata && isInThePast(LSdata.expireDate)) {
            toLoginPage()
        }

    }, [])
    const onFinishHandler = async (e) => {
        let res = await finishExam(e);
        console.log(res);
        if (res.status === "success-finish") {
            navigate("/quiz/join/" + params.quiz)
        }
    }
    
    const fetchData = async () => {
        setIsLoading(true)
        const data = await attemptToJoinExam(params.quiz)
        if(data?.status !== "joined" ){
            let a = data?.message;
            a = a.split("{").join("")
            a =  a.split("}").join("")
            if(a.includes("date")) {a = a.replace("date",data?.date)}
            if(a.includes("time")) {a = a.replace("time",data?.time)}
            alert(a);
            setTimeout(() => {navigate("/quiz/join/" + params.quiz)}, "1000")
        }

        data?.attempt?.answers && setUserAnswered(checkMatchQuestion( data.quiz , data.attempt ));
        setExamData(data);
        setExamDataAttempt(data.attempt);
        setTimeLeft(data.attempt.timer)
        setTotalTime(data.attempt.timer)
        setIsLoading(false)
        
    }

    useEffect(() => {
        fetchData();
        
    }, [])


    return (
        <div className={`${classes.appContainer} ${classes.smSizeAppContainer}`}>
            {
                !isLoading ?

                    examData && <div className={classes.container}>
                        <header className={classes.timeRemainedContainer} style={{ display: 'grid' }}>
                            <ivd className={classes.headerBox}>
                                <div className={classes.buttonContainer}>
                                    <p onClick={() => onFinishHandler(examDataAttempt.id)}>اتمام آزمون</p>
                                    <p  >ترک آزمون</p>
                                </div>
                                <CountDown totalTime={totalTime} timeRemained={timeLeft} />
                            </ivd>
                            <div className={classes.informationBar}>
                                <div className={classes.examDetails}>
                                    <div className={classes.examDetailsTitle}>
                                        <h1>{examData.quiz.title}</h1>
                                        <p>{`(آموزشگاه فراگویان)`}</p>
                                    </div>
                                    <div id={classes.returnBtn} onClick={() => window.location.reload()}>
                                        <p>بازگشت به سایت</p>
                                        <div className={classes.exitIcon}>
                                            <Exit fill='#fff' width="15px" height='15px' />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.personalDetails}>
                                    <ul>
                                        <li>{`نام کاربر : ${LSdata.user_name}`}</li>
                                        <li>{`مدت آزمون : ${examData.quiz.duration} دقیقه`}</li>
                                        <li>{`نوع آزمون : ${examData.quiz.type === "test" ? "تستی" : "تشریحی"}`}</li>
                                        <li>{`ضریب منفی : ${examData.quiz.negative_point === null ? "ندارد" : examData.quiz.negative_point?.replace("/"," به ") }`}</li>
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
                                        <p className={classes.answerDatasheet_answer}>{`پاسخ داده شده : ${examDataAttempt.answered_questions}`}</p>
                                        <p className={classes.answerDatasheet_notAnswer}>{`پاسخ داده نشده : ${examDataAttempt.unanswered_questions}`}</p>
                                    </div>
                                </div>
                                <div className={classes.answerSheet}>
                                    <ol>
                                        {
                                            examData.quiz?.questions?.map((data) => (
                                                <TestAnswerOptions id={data.id} attemptID={examDataAttempt.id} examDataAttempt={examDataAttempt}
                                                    userAnswered={userAnswered}
                                                    options={data.options} score={data.score} />
                                            ))
                                        }
                                    </ol>
                                </div>
                            </div>
                            {/* DISPLAY QUESTION / QUESTION SECTION  */}
                            <section className={classes.questionSection}>
                                <div className={classes.questionSection_header}>
                                    <h2>سوالات آزمون</h2>
                                    <div className={classes.reloadBtn} onClick={() => window.location.reload()}>
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
