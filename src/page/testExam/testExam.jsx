import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { attemptToJoinExam, finishExam } from "../../assets/api/userActions";
import CountDown from "../../components/countDown/countDown";
import { Document, Page ,pdfjs } from 'react-pdf/dist/esm/entry.webpack';
import dummyPDF from "../testPdfExam/dummy.pdf"
import TestAnswerOptions from '../../components/testAnswerOptions';
import TestQuestion from '../../components/testQuestion';

import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from '../../App.module.scss';

function TestExam() {
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
    const navigate = useNavigate();
    const params = useParams();

        const pdf = "https://quiz-api.roomeet.ir/upload/files/pdf/2022/11/ftp_1668959499_dummy.pdf"

    const [examData, setExamData] = useState();
    const [pdfUrl, setPdfUrl] = useState({pdf});
    const [examDataAttempt, setExamDataAttempt] = useState();

    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);


    function isInThePast(date) {
        const today = new Date();
        return date < today;
    }

    function toLoginPage() {
        localStorage.removeItem('userToken');
        navigate(`/quiz/join/${params.quiz}`)
    }

    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (!data) {
            navigate(`/quiz/join/${params.quiz}`)
        }
        if (data && isInThePast(data.expireDate)) {
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
        const data = await attemptToJoinExam(params.quiz)
        // console.log(data.quiz);
        setExamData(data);
        // console.log(data);
        // setExamDataAttemptID(data.attempt.id);
        setExamDataAttempt(data.attempt);
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
                                    <p onClick={() => onFinishHandler(examDataAttempt.id)}>اتمام آزمون</p>
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
                                                <TestAnswerOptions id={data.id} attemptID={examDataAttempt.id} examDataAttempt={examDataAttempt}
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
                                    <Document file={dummyPDF} onLoadError={console.error}>
                                    </Document>
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
