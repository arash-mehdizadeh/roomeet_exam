import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { attemptToJoinExam, finishExam } from "../../assets/api/userActions";


import CountDown from "../../components/countDown/countDown";
import dummy from "./dummy.pdf";
import { Viewer, Worker, ProgressBar } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import TestAnswerOptions from '../../components/testAnswerOptions';
// import TestQuestion from '../../components/testQuestion';


import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from '../../App.module.scss';
import { checkMatchQuestion } from "../../assets/utils/utils";

function TestExam() {

    const characterMap = {
        isCompressed: true,
        // The url has to end with "/"
        url: 'https://unpkg.com/pdfjs-dist@2.6.347/cmaps/',
    };
    const navigate = useNavigate();
    const params = useParams();

    const [examDataAttempt, setExamDataAttempt] = useState([]);
    const [userAnswered, setUserAnswered] = useState()
    const [examData, setExamData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const [pages, setPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    const onFinishHandler = async (e) => {
        let res = await finishExam(e);
        console.log(res);
        if (res.status === "success-finish") {
            navigate("/quiz/join/" + params.quiz)
        }
    }

    // const checkMatchQuestion = (dataQue , dataAtt) => {
    //     let matches = [];
    //     // console.log(dataQue ,dataAtt);
    //         for (var i = 0; i < dataQue.questions.length; i++) {
    //             for (var j = 0; j < dataAtt.answers.length; j++) {
    //                 if (dataQue.questions[i].id === dataAtt.answers[j].question_id) {
    //                     matches.push({
    //                         id : dataQue.questions[i].id,
    //                         option_number : dataAtt.answers[j].option_id
    //                     })
    //                     // console.log(dataQue.questions[i].id);
    //                     // console.log(dataAtt.answers[j].question_id);
    //                     // matches.push(dataQue.questions[i].id);
    //                 }
    //             }
    //         }
    //         setUserAnswered(matches);
    // }

    const fetchData = async () => {
        const data = await attemptToJoinExam(params.quiz)
        if(data?.status !== "joined" ){
            let a = data?.message;
            a = a.split("{").join("")
            a =  a.split("}").join("")
            if(a.includes("date")) {a = a.replace("date",data?.date)}
            if(a.includes("time")) {a = a.replace("time",data?.time)}
            alert(a);
            navigate("/quiz/join/" + params.quiz)
        }

        setExamData(data);
        data.attempt.answers && setUserAnswered(checkMatchQuestion( data.quiz , data.attempt ));
        
        setExamDataAttempt(data.attempt)
        setTimeLeft(data.attempt.timer)
        setTotalTime(data.attempt.timer)

    }

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
        else {
            fetchData();
        }

        // console.log(checkQuestion())
        return () => {
            setIsLoading(false);
        }
    }, [])


    return (
        <div className={classes.appContainer}>
            {
                !isLoading ?

                    examData &&
                    <div className={classes.container}>
                        <header className={classes.timeRemainedContainer} style={{ display: 'grid' }}>
                            <div className={classes.headerBox}>
                                <div className={classes.buttonContainer}>
                                    <p onClick={() => onFinishHandler(examDataAttempt.id)}>اتمام آزمون</p>
                                    <p  >ترک آزمون</p>
                                </div>
                                <CountDown totalTime={totalTime} timeRemained={timeLeft} />

                                {/* <div className='time-remained'>4:20:00</div> */}
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
                                    <li>{`نام کاربر : ${LSdata.user_name}`}</li>
                                        <li>{`مدت آزمون : ${examData.quiz.duration / 60} دقیقه`}</li>
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
                                                <TestAnswerOptions id={data.id} attemptID={examDataAttempt.id}
                                                    userAnswered={ userAnswered }
                                                    options={data.options} score={data.score} attempt={examDataAttempt} />
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
                                    {/* <Document   file={{ URL: "https://quiz-api.roomeet.ir/upload/files/pdf/2022/11/ftp_1667637077_dummy-pdf.pdf" }} onLoadSuccess={onDocumentLoadSuccess}>
                                        <Page pageNumber={pageNumber} />
                                    </Document> */}
                                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                                        <div style={{ height: '750px' }}>
                                            <Viewer
                                                fileUrl={examData?.quiz?.question_pdf}
                                                characterMap={characterMap}

                                            />
                                        </div>
                                    </Worker>

                                </div>
                            </section>
                        </main>

                    </div> : <p>not loaded</p>}
        </div>
    );
}

export default TestExam;
