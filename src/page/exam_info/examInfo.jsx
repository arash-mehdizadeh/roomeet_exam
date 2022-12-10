
import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import Swal from 'sweetalert2';
import classes from '../../App.module.scss';
import { useState, useEffect } from 'react';
import { attemptToJoinExam, examDatails, userLogin } from '../../assets/api/userActions';
import { useNavigate, useParams } from 'react-router-dom';

function ExamInfo() {

    const params = useParams();
    const navigate = useNavigate();

    const [examData, setExamData] = useState();
    const [examTitle, setExamTitle] = useState();
    const [isUserLogged, setIsUserLogged] = useState(false)
    const [inputField, setInputField] = useState({
        phone: "",
        password: ""
    });

    function isInThePast(date) {
        const today = new Date();
        return date < today;
    }

    const today = new Date()
    // console.log("today => ", today)
    let tomorrow = new Date()
    const setExpireDate = tomorrow.setDate(today.getDate() + 1);
    const fetchData = async () => {
        const data = await examDatails(params.quiz)
        // console.table(data);
        setExamTitle(data?.quiz?.title)
        setExamData(data?.quiz)
        return data?.quiz?.title;
    }


    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (!data) {
            navigate(`/quiz/join/${params.quiz}`)
        }
        if (data) {
            setIsUserLogged(true);
        }
        if (data && isInThePast(data.expireDate)) {
            localStorage.removeItem('userToken');
            window.location.reload();
        }
        let examTitle = fetchData();
        examTitle.then(res => document.title = `اطلاعات آزمون ${res}`)
    }, [])

    const inputHandler = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value });
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

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        // console.log(inputField);
        const userData = await userLogin(inputField);

        typeof (userData) === "string" && Swal.fire({
            icon: "error",
            title: `${userData}`,
        })
        // console.log(userData);  
        localStorage.setItem("userToken", JSON.stringify({
            ...userData, "expireDate": setExpireDate
        }))
        window.location.reload();
    }

    const examPageHandler = async () => {
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
                title: `برای ورود به آزمون وارد حساب کاربری بشوید"`,
            })
            // alert("برای ورود به آزمون وارد حساب کاربری بشوید")
        }

    }

    return (
        <div className={classes.appContainer} style={{minHeight:"100vh",maxHeight:"100%"}}>
            <div className={classes.container}>
                {/* DISPLAY QUESTION / QUESTION SECTION  */}
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
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>تاریخ ورود آزمون :</p>
                                    <p className={classes.examInfo__detail}>{examData?.date}</p>
                                </div>
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>شروع و ورود آزمون :</p>
                                    {examData?.start_time_from == null ? <p className={classes.examInfo__detail}>هر ساعتی</p> :
                                        <p className={classes.examInfo__detail}>{`${examData?.start_time_from} تا ${examData?.start_time_to}`}</p>}
                                </div>
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>پایان آزمون :</p>
                                    <p className={classes.examInfo__detail}>{`${examData?.duration} دقیقه بعد از شروع آزمون`}</p>
                                </div>
                                {
                                    handleResultShow()
                                }
                                {/* <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>نمایش کارنامه تستی  از تاریخ:</p>
                                    <p className={classes.examInfo__detail}>{examData?.show_result_from.replace(" ", " در ساعت ")}</p>
                                </div>
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>نمایش کارنامه تستی  تا تاریخ:</p>
                                    <p className={classes.examInfo__detail}>{examData?.show_result_to.replace(" ", " در ساعت ")}</p>
                                </div> */}
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
                        <div className={classes.examInfo__login_section} style={{ display: isUserLogged ? "none" : "flex" }}>
                            <form className={classes.examInfo__login} onSubmit={onSubmitHandler} >
                                <div className={classes.examInfo__login_title}>
                                    <h3>ورود</h3>
                                </div>
                                <div className={classes.examInfo__login_title}>
                                    <p className={classes.examInfo__login_info}>لطفا وارد حساب کاربری خود شوید</p>
                                </div>
                                <input type="text" placeholder='شماره تلفن' name='phone' value={inputField.phone} onChange={inputHandler} className={classes.examInfo__login_input} />
                                <input type="password" placeholder='رمز عبور' name='password' value={inputField.password} onChange={inputHandler} className={classes.examInfo__login_input} style={{ marginBottom: "6px" }} />
                                <p id={classes.forgetPassword}>فراموشی رمز عبور</p>
                                <button type="submit" className={classes.examInfo__login_btn}>ورود</button>
                            </form>
                        </div>
                    </div>
                    <div className={classes.examInfo__btn_container}>
                        <button onClick={() => examPageHandler()} className={classes.examInfo__btn}>شروع  آزمون و مشاهده سوالات</button>
                    </div>
                </section>

            </div>
        </div>
    );
}

export default ExamInfo;
