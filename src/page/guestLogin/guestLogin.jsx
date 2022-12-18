
import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import Swal from 'sweetalert2';
import classes from '../../App.module.scss';
import { useState, useEffect } from 'react';
import { attemptToJoinExam, confirmGuestLoginRequest, confirmMessageRequest, examDatails, guestLoginPhone, guestVerification, userLogin } from '../../assets/api/userActions';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/loading/loading';

function GuestLogin() {

    const params = useParams();
    const navigate = useNavigate();

    const [examData, setExamData] = useState();
    const [counter, setCounter] = useState(null);
    const [verify, setVerify] = useState();
    const [isLoading, setIsLoading] = useState(true)
    const [showMessage, setShowMessage] = useState(false);
    const [isClickedOnSentPassword, setIsClickedOnSentPassword] = useState(false)
    const [guestInputField, setGuestInputField] = useState({
        name: "",
        phone: "",
        code: ""
    });


    useEffect(() => {
        if (counter === 0) {
            setShowMessage(true)
            setCounter(null)
        }
        if (!counter) return;
        const intervalId = setInterval(() => {
            setCounter(counter - 1);
        }, 1000);
        return () => clearInterval(intervalId);
    }, [counter]);


    const successGuestLoginHandler = (data) => {
        localStorage.setItem("userToken", JSON.stringify(data));
        if (examData?.type === "test" && examData?.question_type === "custom") {
            navigate(`/quiz/test/${params.quiz}`);
        }
        else if (examData?.type === "test" && examData?.question_type === "pdf") {
            navigate(`/quiz/test-pdf/${params.quiz}`);
        }
        else if (examData?.type === "descriptive" && examData?.question_type === "custom") {
            navigate(`/quiz/descriptive/${params.quiz}`);
        }
        else if (examData?.type === "descriptive" && examData?.question_type === "pdf") {
            navigate(`/quiz/descriptive-pdf/${params.quiz}`);
        }
    }

    const onSubmitLogin = async (res) => {
        console.log(res);
        if (!res) {
            Swal.fire({
                icon: "error",
                title: "رمز وارد شده اشتباه است",
                confirmButtonText: "باشه"
            })
        }
        else {
            examPageHandler()
        }
    }
    const onGuestSendLogin = async () => {
        if (!guestInputField.name) {
            Swal.fire({ icon: "error", title: "لطفا اسم خود را بنویسید" })
        }
        else if (!guestInputField.phone) {
            Swal.fire({ icon: "error", title: "لطفا شماره را بنویسید" })
        }
        else if (!guestInputField.code) {
            Swal.fire({ icon: "error", title: "لطفا کد تایید را بنویسید" })
        }
        else {
            await confirmGuestLoginRequest({ ...guestInputField, quizCode: params.quiz }).then(res => onSubmitLogin(res));
        }
    }

    const onAuthGuestHandler = async (res) => {
        if (!guestInputField.name) {
            Swal.fire({ icon: "error", title: "لطفا اسم خود را بنویسید" })
        }
        else if (!guestInputField.phone) {
            Swal.fire({ icon: "error", title: "لطفا شماره را بنویسید" })
        }
        else {
            let { code, ...newData } = guestInputField;
            newData = { ...newData, quiz_code: params.quiz };
            await guestLoginPhone(newData).then(res => successGuestLoginHandler(res));
        }
    }


    const fetchGuestValidation = async () => {
        guestVerification(params.quiz).then(res => setVerify(res));
    }

    const fetchData = async () => {
        const data = await examDatails(params.quiz)
        // console.table(data);
        setExamData(data?.quiz)
        setIsLoading(false)
        return data?.quiz?.title;
    }


    useEffect(() => {
        let examTitle = fetchData();
        fetchGuestValidation()
        examTitle.then(res => document.title = `اطلاعات آزمون ${res}`)
    }, [])

    const guestInputHandler = (e) => {
        setGuestInputField({ ...guestInputField, [e.target.name]: e.target.value });
    }




    const handleResultShow = () => {
        // examData?.show_result
        if (examData?.show_result === "range") {
            return <>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>نمایش کارنامه تستی  از تاریخ:</p>
                    <p className={classes.examInfo__detail}>{examData?.show_result_from.replace(" ", " در ساعت ")}</p>
                </div>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>نمایش کارنامه تستی  تا تاریخ:</p>
                    <p className={classes.examInfo__detail}>{examData?.show_result_to.replace(" ", " در ساعت ")}</p>
                </div>
            </>
        }
        else if (examData?.show_result === "no_display") {
            return <>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>نمایش کارنامه تستی:</p>
                    <p className={classes.examInfo__detail}>عدم نمایش</p>
                </div>
            </>
        }
        else {
            return <>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>نمایش کارنامه تستی:</p>
                    <p className={classes.examInfo__detail}>پس از اتمام آزمون</p>
                </div>
            </>
        }
    }



    const handleSendNumber = async (res) => {
        console.log(res);
        if (res.returncode === "success") {
            setCounter(90);
            setIsClickedOnSentPassword(true);
        }
        else {
            Swal.fire({
                icon: "error",
                title: `${res.error}`
            })
        }
    }

    const onGuestSendPhone = async () => {
        var regex = new RegExp('^(\\+98|0)?9\\d{9}$');

        if (guestInputField.name.length <= 0) {
            Swal.fire({
                icon: "error",
                title: "اسم خود را وارد کنید",
                confirmButtonText: "باشه"

            })
        }
        else if (guestInputField.phone.length !== 11 && guestInputField.phone.length !== 0) {
            Swal.fire({
                icon: "error",
                title: "شماره وارد شده صحیح نمیباشد",
                confirmButtonText: "باشه"

            })
        }
        else if (!guestInputField.phone.length) {
            Swal.fire({
                icon: "error",
                title: "شماره خود را وارد کنید",
                confirmButtonText: "باشه"
            })
        }
        else if (!regex.test(guestInputField.phone.toString())) {
            Swal.fire({
                icon: "error",
                title: "فرمت شماره وارد شده صحیح نمیباشد",
                confirmButtonText: "باشه"

            })
        }
        else {
            // console.log(params.quiz);
            await confirmMessageRequest(guestInputField.name, guestInputField.phone, params.quiz).then(res => handleSendNumber(res));
        }
    }

    const examPageHandler = async () => {

        // window.sessionStorage.setItem()

        let data = JSON.parse(localStorage.getItem('userToken'));

        if (data) {
            let res = await attemptToJoinExam(params.quiz)
            // console.log(res);
            if (res?.status !== "joined") {
                let a = res?.message;
                a = a.split("{").join("")
                a = a.split("}").join("")
                if (a.includes("date")) { a = a.replace("date", res?.date) }
                if (a.includes("time")) { a = a.replace("time", res?.time) }
                Swal.fire({
                    icon: "error",
                    title: `${a}`,
                })
            }
            else {
                if (examData?.type === "test" && examData?.question_type === "custom") {
                    navigate(`/quiz/test/${params.quiz}`);
                }
                if (examData?.type === "test" && examData?.question_type === "pdf") {
                    navigate(`/quiz/test-pdf/${params.quiz}`);
                }
                if (examData?.type === "descriptive" && examData?.question_type === "custom") {
                    navigate(`/quiz/descriptive/${params.quiz}`);
                }
                if (examData?.type === "descriptive" && examData?.question_type === "pdf") {
                    navigate(`/quiz/descriptive-pdf/${params.quiz}`);
                }
            }
        }
        else {
            Swal.fire({
                icon: "error",
                title: `برای ورود به آزمون وارد حساب کاربری بشوید`,
                confirmButtonText: "باشه"
            })
        }

    }

    return (
        <div className={classes.appContainer} style={{ minHeight: "100vh", maxHeight: "100%" }}>
            <div className={classes.container}>
                {!isLoading ?
                    <section className={classes.questionSection}>
                        <div className={classes.questionSection_header} style={{ alignItems: "center" }}>
                            <h2>اطلاعات آزمون</h2>
                            <div id={classes.returnBtn}>
                                <p>بازگشت به سایت</p>
                                <div className={classes.exitIcon}>
                                    <Exit fill='#fff' width="15px" height='15px' />
                                </div>
                            </div>
                        </div>
                        <div className={`${classes.questionContainer} ${classes.examInfo__container}`} >
                            {
                                <div style={{ width: "100%" }} key={examData?.id}>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>نام آموزشگاه :</p>
                                        <p className={classes.examInfo__detail}>{"آموزشگاه فراگویان"}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>عنوان آزمون :</p>
                                        <p className={classes.examInfo__detail}>{examData?.title}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>تعداد سوالات :</p>
                                        <p className={classes.examInfo__detail}>{examData?.number_of_question}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>نوع آزمون :</p>
                                        <p className={classes.examInfo__detail}>{examData?.type == "test" ? "تست" : "تشریحی"}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>ضریب منفی تست :</p>
                                        <p className={classes.examInfo__detail}>{examData?.negative_point ? examData?.negative_point : "ندارد"}</p>
                                    </div>
                                    {
                                        examData?.date &&
                                        <div className={classes.examInfo__info_container}>
                                            <p className={classes.examInfo__title}>تاریخ ورود آزمون :</p>
                                            <p className={classes.examInfo__detail}>{examData?.date}</p>
                                        </div>
                                    }
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>شروع و ورود آزمون :</p>
                                        {examData?.start_time_from == null ? <p className={classes.examInfo__detail}>هر ساعتی</p> :
                                            <p className={classes.examInfo__detail}>{`${examData?.start_time_from} تا ${examData?.start_time_to}`}</p>}
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>پایان آزمون :</p>
                                        <p className={classes.examInfo__detail}>{`${examData?.duration ? examData?.duration + " دقیقه بعد از شروع آزمون" : "نامحدود"}`}</p>
                                    </div>
                                    {
                                        handleResultShow()
                                    }
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>امکان ترک آزمون :</p>
                                        <p className={classes.examInfo__detail}>{examData?.leave == 0 ? "ندارد" : "دارد"}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>فعال بودن آزمون :</p>
                                        <p className={classes.examInfo__detail}>{examData?.active == 0 ? "غیر فعال" : "فعال"}</p>
                                    </div>
                                </div>
                                // ))
                            }
                            <div className={classes.examInfo__login_section} style={{ display: "flex" }}>
                                <div className={classes.examInfo__login} >
                                    <div className={classes.examInfo__login_title}>
                                        <h3>ورود مهمان</h3>
                                    </div>
                                    <div className={classes.examInfo__login_title}>
                                        <p className={classes.examInfo__login_info}>لطفا وارد حساب کاربری خود شوید</p>
                                    </div>
                                    <input type="text" placeholder='نام و نام خانوادگی' name='name' value={guestInputField.name} onChange={guestInputHandler} className={classes.examInfo__login_input} />
                                    <input type="number" placeholder='شماره تلفن' name='phone' value={guestInputField.phone} onChange={guestInputHandler} className={classes.examInfo__login_input} />
                                    {isClickedOnSentPassword && <input type="number" autoComplete="new-password" placeholder='رمز ارسال شده' name='code' value={guestInputField.code} onChange={guestInputHandler} className={classes.examInfo__login_input} style={{ marginBottom: "6px" }} />}
                                    {isClickedOnSentPassword && !showMessage && <p id={classes.resendMessage}>{`${counter} ثانیه مانده تا دریافت کد مجدد`}</p>}
                                    {showMessage && <p id={classes.forgetPassword} className={classes.examInfo__changeField}  >پیامی دریافت نکرده اید ؟<br />ارسال مجدد کد</p>}
                                    {
                                        verify.guestDetection ?
                                            isClickedOnSentPassword ?
                                                <button className={classes.examInfo__login_btn} onClick={() => onGuestSendLogin()} >ورود</button>
                                                :
                                                <button className={classes.examInfo__login_btn} onClick={() => onGuestSendPhone()} >ارسال رمز ورود</button>
                                            :

                                            <button className={classes.examInfo__login_btn} onClick={() => onAuthGuestHandler()} >ورود</button>

                                    }
                                    <p id={classes.forgetPassword} className={classes.examInfo__changeField} onClick={() => navigate(`/quiz/join/${params.quiz}`)} >ورود کاربر</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    :
                    <>
                        <Loading />
                    </>
                }
            </div>
        </div>
    );
}

export default GuestLogin;
