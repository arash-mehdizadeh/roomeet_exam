import { useState, useEffect } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { attemptToJoinExam } from "../../assets/api/userActions";


import CountDown from "../../components/countDown/countDown";
import dummy from "./dummy.pdf";
import { Viewer, Worker, ProgressBar } from '@react-pdf-viewer/core';
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5';
import '@react-pdf-viewer/core/lib/styles/index.css';

import TestAnswerOptions from '../../components/testAnswerOptions';
// import TestQuestion from '../../components/testQuestion';


import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from '../../App.module.scss';

function TestExam() {

    const characterMap = {
        isCompressed: true,
        // The url has to end with "/"
        url: 'https://unpkg.com/pdfjs-dist@2.6.347/cmaps/',
    };

    const [pages, setPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    function onDocumentLoadSuccess({ numPages }) {
        console.log("object:", numPages, pages);
        setPages(numPages);
        setPageNumber(1);
    }

    const navigate = useNavigate();
    const params = useParams();

    const [examData, setExamData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    const fetchData = async () => {
        const data = await attemptToJoinExam(params.quiz)
        // console.log(data.quiz);
        setExamData(data)
        console.log(data);
        setTimeLeft(data.quiz.duration)
        setTotalTime(data.quiz.duration)

    }

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
        console.log(fetchData());
    }, [])

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

                    examData &&
                    <div className={classes.container}>
                        <header className={classes.timeRemainedContainer} style={{ display: 'grid' }}>
                            <div className={classes.headerBox}>
                                <div className={classes.buttonContainer}>
                                    <p>اتمام آزمون</p>
                                    <p  >ترک آزمون</p>
                                </div>
                                <CountDown totalTime={totalTime} timeRemained={timeLeft} />

                                {/* <div className='time-remained'>4:20:00</div> */}
                            </div>
                            <div className={classes.informationBar}>
                                <div className={classes.examDetails}>
                                    <div className={classes.examDetailsTitle}>
                                        <h1>{`آزمون ادبیات فارسی`}</h1>
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
                                        <li>{`مدت آزمون : ${60} دقیقه`}</li>
                                        <li>{`نوع آزمون : ${"تستی"}`}</li>
                                        <li>{`ضریب منفی : ${"3 به 1"}`}</li>
                                        <li>{`تعداد سوالات : ${100}`}</li>
                                    </ul>
                                </div>
                            </div>
                        </header>

                        <main className={classes.mainContainer}>
                            <div className={classes.answerSheetContainer}>
                                <div className={classes.answerSheetHeader}>
                                    <h3>پاسخنامه</h3>
                                    <div className={classes.answerDatasheet}>
                                        <p className={classes.answerDatasheet_answer}>{`پاسخ داده شده : ${85}`}</p>
                                        <p className={classes.answerDatasheet_notAnswer}>{`پاسخ داده نشده : ${0}`}</p>
                                    </div>
                                </div>
                                <div className={classes.answerSheet}>
                                    <ol>
                                        {
                                            examData.quiz?.questions?.map((data) => (
                                                <TestAnswerOptions id={data.id} options={data.options} score={data.score} />
                                            ))
                                        }
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
                                    {/* <Document   file={{ URL: "https://quiz-api.roomeet.ir/upload/files/pdf/2022/11/ftp_1667637077_dummy-pdf.pdf" }} onLoadSuccess={onDocumentLoadSuccess}>
                                        <Page pageNumber={pageNumber} />
                                    </Document> */}
                                    <Worker  workerUrl="https://unpkg.com/pdfjs-dist@3.0.279/build/pdf.worker.min.js">
                                            <div style={{ height: '750px' }}>
                                                <Viewer
                                                    fileUrl={dummy}
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
