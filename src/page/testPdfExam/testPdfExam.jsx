import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { attemptToJoinExam, finishExam, getSchoolName, leaveExam } from "../../assets/api/userActions";
import Swal from 'sweetalert2';

import CountDown from "../../components/countDown/countDown";
// import dummy from "./dummy.pdf";
import { Viewer, Worker, ProgressBar } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

import TestAnswerOptions from '../../components/testAnswerOptions';
// import TestQuestion from '../../components/testQuestion';


import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from '../../App.module.scss';
import { checkMatchQuestion } from "../../assets/utils/utils";
import Loading from "../../components/loading/loading";
import ExitModal from "../../components/modal/exitModal";

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
    const [answered, setAnswered] = useState();
    const [schoolName, setSchoolName] = useState("");
    const [unAnswered, setUnAnswered] = useState()
    const [exitConfirm, setExitConfirm] = useState(false)
    const [isLeave, setIsLeave] = useState(false)

    // const [pages, setPages] = useState(null);
    // const [pageNumber, setPageNumber] = useState(1);

    const fetchSchoolName = async () => {
        await getSchoolName(params.quiz).then(res => setSchoolName(res.schoolName))
    }
    const onFinishHandler = async (e) => {
        let res = await finishExam(e);
        console.log(res);
        if (res.status === "success-finish") {
            navigate("/quiz/finish")
        }
        else {
            Swal.fire({
                icon: "warning",
                title: `${res.message}`
            })
        }
    }

    const onLeaveHandler = async (e) => {
        let res = await leaveExam(e);
        console.log(res);
        if (res.status === "success-leave") {
            navigate("/quiz/join/" + params.quiz)
        }
        else {
            Swal.fire({
                icon: "warning",
                title: `${res.message}`
            })
        }
    }

    const onConfirm = () => {
        // console.log(data);
        if (isLeave) {
            onLeaveHandler(examDataAttempt.id)
        }
        else {
            onFinishHandler(examDataAttempt.id)
        }
    }

    const onClose = () => {
        setExitConfirm(prev => !prev)
    }


    const fetchData = async () => {
        const data = await attemptToJoinExam(params.quiz)
        if (data?.status !== "joined") {
            let a = data?.message;
            a = a.split("{").join("")
            a = a.split("}").join("")
            if (a.includes("date")) { a = a.replace("date", data?.date) }
            if (a.includes("time")) { a = a.replace("time", data?.time) }
            Swal.fire({
                icon: "error",
                title: `${a}`,
            })
            navigate("/quiz/join/" + params.quiz)
        }

        setExamData(data);
        data.attempt.answers && setUserAnswered(checkMatchQuestion(data.quiz, data.attempt));

        setExamDataAttempt(data.attempt)
        setTimeLeft(data.attempt.timer)
        setTotalTime(data.attempt.total_time)
        setIsLoading(false);
        setAnswered(data.attempt.answered_questions)
        setUnAnswered(data.attempt.unanswered_questions)
        return data.quiz.title;

    }

    const answerResHandler = (data) => {
        // console.log(data);
        setAnswered(data.answered_questions);
        setUnAnswered(data.unanswered_questions)
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
        document.title = '???????? ??????????';
        if (!LSdata) {
            navigate(`/quiz/join/${params.quiz}`)
        }
        if (LSdata && isInThePast(LSdata.expireDate)) {
            toLoginPage()
        }
        let examTitle = fetchData();
        fetchSchoolName();
        examTitle.then(res => document.title = `?????????? ${res}`)

    }, [])


    return (
        <div className={`${classes.appContainer} ${classes.examAppContainer}`} >
            {
                !isLoading ?

                    examData &&
                    <div className={classes.container}>
                        {
                            exitConfirm &&
                            <ExitModal onClose={onClose} leave={isLeave} onConfirm={onConfirm} />
                        }
                        <header className={classes.timeRemainedContainer} style={{ display: 'grid' }}>
                            <div className={classes.headerBox}>
                                <div className={classes.buttonContainer}>
                                    <p onClick={() => { setIsLeave(false); setExitConfirm(true) }}>?????????? ??????????</p>
                                    {examData.quiz.leave ? <p onClick={() => { setIsLeave(true); setExitConfirm(true) }}>?????? ??????????</p> : ""}
                                </div>
                                {timeLeft !== "unlimited" ? <CountDown totalTime={totalTime} timeRemained={timeLeft} /> : <p className={classes.unlimited_text}>???????? ?????????????????? : ??????????????</p>}


                                {/* <div className='time-remained'>4:20:00</div> */}
                            </div>
                            <div className={classes.informationBar}>
                                <div className={classes.examDetails}>
                                    <div className={classes.examDetailsTitle}>
                                        <h1>{examData.quiz.title}</h1>
                                        <p>{`(${schoolName})`}</p>
                                    </div>
                                    <div id={classes.returnBtn}>
                                        <p>???????????? ???? ????????</p>
                                        <div className={classes.exitIcon}>
                                            <Exit fill='#fff' width="15px" height='15px' />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.personalDetails}>
                                    <ul>
                                        <li>{`?????? ?????????? : ${LSdata.name}`}</li>
                                        <li>{`?????? ?????????? : ${examData?.quiz?.duration ? examData?.quiz?.duration + " ?????????? " : "??????????????"}`}</li>
                                        <li>{`?????? ?????????? : ${examData.quiz.type === "test" ? "????????" : "????????????"}`}</li>
                                        {
                                            examData.quiz.test_type === "score" ?
                                                <li>{`???????? ???? : ${examData.quiz.total_score}`}</li>
                                                : <li>{`???????? ???????? : ${examData.quiz.negative_point === null ? "??????????" : examData.quiz.negative_point?.replace("/", " ???? ")}`}</li>
                                        }
                                        <li>{`?????????? ???????????? : ${examData.quiz.number_of_question}`}</li>
                                    </ul>
                                </div>
                            </div>
                        </header>

                        <main className={classes.mainContainer}>
                            <div className={classes.answerSheetContainer}>
                                <div className={classes.answerSheetHeader}>
                                    <h3>????????????????</h3>
                                    <div className={classes.answerDatasheet}>
                                        <p className={classes.answerDatasheet_answer}>{`???????? ???????? ?????? : ${answered === null ? 0 : answered}`}</p>
                                        <p className={classes.answerDatasheet_notAnswer}>{`???????? ???????? ???????? : ${unAnswered === null ? 0 : unAnswered}`}</p>

                                    </div>
                                </div>
                                <div className={classes.answerSheet}>
                                    <ol>
                                        {
                                            examData.quiz?.questions?.map((data) => (
                                                <TestAnswerOptions id={data.id} attemptID={examDataAttempt.id} examDataAttempt={examDataAttempt}
                                                    userAnswered={userAnswered} isRank={examData.quiz.test_type} answerResHandler={answerResHandler}
                                                    options={data.options} score={data.score} attempt={examDataAttempt} />
                                            ))
                                        }
                                    </ol>
                                </div>
                            </div>
                            {/* DISPLAY QUESTION / QUESTION SECTION  */}
                            <section className={classes.questionSection}>
                                <div className={classes.questionSection_header}>
                                    <h2>???????????? ??????????</h2>
                                    <div className={classes.reloadBtn} onClick={() => window.location.reload()}>
                                        <p>???????????????? ????????</p>
                                        <div id={classes.refreshIcon}>
                                            <Refresh />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.questionContainer}>
                                    {/* <Document   file={{ URL: "https://quiz-api.roomeet.ir/upload/files/pdf/2022/11/ftp_1667637077_dummy-pdf.pdf" }} onLoadSuccess={onDocumentLoadSuccess}>
                                        <Page pageNumber={pageNumber} />
                                    </Document> */}
                                    {/* <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                                        <div style={{ height: '750px' }}>
                                            <Viewer
                                                fileUrl={examData?.quiz?.question_pdf}
                                                characterMap={characterMap}

                                            />
                                        </div>
                                    </Worker> */}
                                    <iframe src={examData?.quiz?.question_pdf} title="pdf"
                                        style={{ width: "100%", height: "500px" }} frameborder="0"></iframe>
                                </div>
                            </section>
                        </main>

                    </div> : <>
                        <Loading />
                    </>
            }
        </div>
    );
}

export default TestExam;
