import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { attemptToJoinExam, finishExam, getSchoolName, leaveExam, previewExam } from "../../../assets/api/userActions";
import CountDown, { PreviewCountdown } from "../../../components/countDown/countDown";
import ExitModal from "../../../components/modal/exitModal";


import Swal from 'sweetalert2';




import { ReactComponent as Exit } from '../../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../../assets/icons/RightSquare.svg';

import classes from '../../../App.module.scss';
import { checkMatchQuestionURL } from "../../../assets/utils/utils";
import Loading from "../../../components/loading/loading";
import PreviewUploadButtons from "../../../components/previewAnswerButtons/descriptiveUploadButtons/previewUplaodButton";

function DescriptivePdfPreview() {

    const [ searchParams ] = useSearchParams()
    const navigate = useNavigate();
    const params = useParams();

    const [activeBtn, setActiveBtn] = useState(null);
    const [examData, setExamData] = useState();
    const [userAnswered, setUserAnswered] = useState()
    const [examDataAttempt, setExamDataAttempt] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [totalTime, setTotalTime] = useState(0);
    const [answered, setAnswered] = useState();
    const [schoolName, setSchoolName] = useState("");
    const [unAnswered, setUnAnswered] = useState();
    const [exitConfirm, setExitConfirm] = useState(false)
    const [isLeave, setIsLeave] = useState(false)

    const fetchData = async () => {
        
        const paramsToken =  searchParams.get("_token");
        const data = await previewExam(params.quiz ,paramsToken);
       
        if (data?.status !== "joined") {
            let a = data?.message;
            a = a.split("{").join("")
            a = a.split("}").join("")
            if (a.includes("date")) { a = a.replace("date", data?.date) }
            if (a.includes("time")) { a = a.replace("time", data?.time) }
            // alert(a);
            setTimeout(() => { navigate("/quiz/join/" + params.quiz) }, "2000")
        }
        // data.attempt.answers && setUserAnswered(checkMatchQuestionURL(data.quiz, data.attempt));
        setExamData(data)
        setUnAnswered(data?.quiz.number_of_question)
        setIsLoading(false)
        return data.quiz.title;
    }

    const fetchSchoolName = async() => {
        await getSchoolName(params.quiz).then(res => setSchoolName(res.schoolName))
    }

    const answerResHandler = (data) => {
        // console.log(data);
        setAnswered(data.answered_questions);
        setUnAnswered(data.unanswered_questions)
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


    useEffect(() => {
        let examTitle = fetchData();
        fetchSchoolName();
        examTitle.then(res => document.title = `پیشنمایش آزمون ${res}`)
    }, [])



    const activeBtnHandler = (index) => {
        setActiveBtn(index);
    }
    const nullingActiveBtnHandler = () => {
        setActiveBtn(null);
    }

    return (
        <div className={`${classes.appContainer} ${classes.examAppContainer}`}>
            {
                !isLoading ?

                    examData && <div className={classes.container}>
                        {
                            exitConfirm &&
                            <ExitModal onClose={onClose} leave={isLeave} onConfirm={onConfirm} />
                        }
                        <header className={classes.timeRemainedContainer} style={{ display: 'grid' }}>
                            <div className={classes.headerBox}>
                                <div className={classes.buttonContainer}>
                                    <p onClick={() => { setIsLeave(false); setExitConfirm(true) }}>اتمام پیشنمایش</p>
                                    <p onClick={() => { setIsLeave(true); setExitConfirm(true) }}>ترک آزمون</p>
                                </div>
                                <PreviewCountdown  totalTime={totalTime}/>
                            </div>
                            <div className={classes.informationBar}>
                                <div className={classes.examDetails}>
                                    <div className={classes.examDetailsTitle}>
                                        <h1>{examData.quiz.title}</h1>
                                        <p>{`(${schoolName})`}</p>
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
                                        <li>{`نام کاربر : ${"کاربر"}`}</li>
                                        <li>{`مدت آزمون : ${examData?.quiz?.duration ? examData?.quiz?.duration +" دقیقه " : "نامحدود" }`}</li>
                                        <li>{`نوع آزمون : ${examData.quiz.type === "test" ? "تستی" : "تشریحی"}`}</li>
                                        <li>{`ضریب منفی : ${examData.quiz.negative_point === null ? "ندارد" : examData.quiz.negative_point?.replace("/", " به ")}`}</li>
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
                                    <p className={classes.answerDatasheet_answer}>{`پاسخ داده شده : 0`}</p>
                                        <p className={classes.answerDatasheet_notAnswer}>{`پاسخ داده نشده : ${unAnswered === null ? 0 : unAnswered}`}</p>
                                    </div>
                                </div>
                                <div className={classes.uploadAnswersSheet}>
                                    <ol>
                                        {
                                            examData.quiz?.questions?.map((data) => (
                                                <PreviewUploadButtons
                                                    index={data.id} quNo={data.question_number} options={data.options} score={data.score}
                                                    activeBtn={activeBtn} 
                                                    activeBtnHandler={activeBtnHandler}
                                                    userAnswered={userAnswered} answerResHandler={answerResHandler}
                                                    nullingActiveBtnHandler={nullingActiveBtnHandler}
                                                />
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
                                <iframe src={examData?.quiz?.question_pdf} title="pdf"
                                        style={{width:"100%", height:"500px"}} frameborder="0"></iframe>
                                </div>
                            </section>
                        </main>

                    </div> : <>
                        <Loading />
                    </>}
        </div>
    );
}

export default DescriptivePdfPreview;
