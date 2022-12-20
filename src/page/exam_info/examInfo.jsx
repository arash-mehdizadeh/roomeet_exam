
import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import Swal from 'sweetalert2';
import classes from '../../App.module.scss';
import { useState, useEffect } from 'react';
import { attemptToJoinExam, examDatails, guestVerification, userLogin } from '../../assets/api/userActions';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loading from '../../components/loading/loading';

function ExamInfo() {

    const [searchParams] = useSearchParams();
    const params = useParams();
    const navigate = useNavigate();
    const [verify, setVerify] = useState();
    const [examData, setExamData] = useState();
    const [isUserLogged, setIsUserLogged] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    const [inputField, setInputField] = useState({
        phone: "",
        password: ""
    });


    const validExamHandler = (data) => {
        if (!data.validation){
            navigate("/service/not-active");
        }
    }

    const fetchGuestValidation = async () => {
        // console.log("aaa");
        await guestVerification(params.quiz).then(res => {setVerify(res);validExamHandler(res) });
    }

    function isInThePast(date) {
        const today = new Date();
        return date < today;
    }

    const today = new Date()
    let tomorrow = new Date()
    const setExpireDate = tomorrow.setDate(today.getDate() + 1);

    const fetchData = async () => {
        const data = await examDatails(params.quiz)
        if (data.status === "not-found"){
            Swal.fire({
                icon: "error",
                title: `${data.message}`
            })
            
        }
        else{
            setExamData(data);
            // console.table(data);
            setExamData(data?.quiz)
            setIsLoading(false)
            return data?.quiz?.title;
        }
    }


    useEffect(() => {

        const paramsID = searchParams.get("_id");
        const paramsToken = searchParams.get("_token");
        const paramsName = searchParams.get("_name");
        // console.log(paramsName);
        let queryToken = {
            quizToken: paramsToken,
            user_id: paramsID,
            name: paramsName,
            expireDate: setExpireDate,
        }
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (paramsID && paramsToken) {
            if (data) {
                localStorage.removeItem("userToken");
                localStorage.setItem("userToken", JSON.stringify(queryToken))
                setIsUserLogged(true)
                // window.location.reload()
            }
            else {
                localStorage.setItem("userToken", JSON.stringify(queryToken))
                setIsUserLogged(true)
            }
        }
        else {
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
        }
        fetchGuestValidation();
        let examTitle = fetchData();
        examTitle.then(res => document.title = res === undefined ? `اطلاعات آزمون وجود ندارد` : `اطلاعات آزمون ${res}`)
    }, [])
    const LS_data = JSON.parse(localStorage.getItem("userToken"))
    const inputHandler = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value });
    }




    const handleResultShow = () => {
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
        const userData = await userLogin(inputField);
        var regex = new RegExp('^(\\+98|0)?9\\d{9}$');
        if (inputField.phone.length !== 11 && inputField.phone.length !== 0) {
            Swal.fire({
                icon: "error",
                title: "شماره وارد شده صحیح نمیباشد",
                confirmButtonText: "باشه"

            })
        }
        else if (!inputField.phone.length) {
            Swal.fire({
                icon: "error",
                title: "شماره خود را وارد کنید",
                confirmButtonText: "باشه"
            })
        }
        else if (!regex.test(inputField.phone.toString())) {
            Swal.fire({
                icon: "error",
                title: "فرمت شماره وارد شده صحیح نمیباشد",
                confirmButtonText: "باشه"

            })
        }

        else if (userData === undefined) {
            Swal.fire({
                icon: "error",
                title: `کاربری با این مشخصات پیدا نشده`
            })
        }
        else {
            typeof (userData) === "string" && Swal.fire({
                icon: "error",
                title: `${userData}`,
            })
            localStorage.setItem("userToken", JSON.stringify({
                ...userData, "expireDate": setExpireDate
            }))
            window.location.reload();
        }
    }


    const examPageHandler = async () => {
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (data) {
            let res = await attemptToJoinExam(params.quiz,data.quizToken)
            // console.log(res);
            if (res?.status !== "joined" || res === undefined) {
                let a = res?.message;
                console.log(a);
                a = a?.split("{").join("")
                a = a?.split("}").join("")
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
                    window.location.reload()
                }
                if (examData?.type === "test" && examData?.question_type === "pdf") {
                    navigate(`/quiz/test-pdf/${params.quiz}`);
                    window.location.reload()
                }
                if (examData?.type === "descriptive" && examData?.question_type === "custom") {
                    navigate(`/quiz/descriptive/${params.quiz}`);
                    window.location.reload()
                }
                if (examData?.type === "descriptive" && examData?.question_type === "pdf") {
                    navigate(`/quiz/descriptive-pdf/${params.quiz}`);
                    window.location.reload()
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
                    <section section className={classes.questionSection}>
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
                                        <p className={classes.examInfo__title}>نام شرکت کننده :</p>
                                        <p className={classes.examInfo__detail}>{isUserLogged ? LS_data.name : "وارد حساب کاربری خود نشده اید." }</p>
                                    </div>
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
                            <div className={classes.examInfo__login_section} style={{ display: isUserLogged ? "none" : "flex" }}>
                                <form className={classes.examInfo__login} onSubmit={onSubmitHandler} >
                                    <div className={classes.examInfo__login_title}>
                                        <h3>ورود</h3>
                                    </div>
                                    <div className={classes.examInfo__login_title}>
                                        <p className={classes.examInfo__login_info}>لطفا وارد حساب کاربری خود شوید</p>
                                    </div>
                                    <input type="number" placeholder='شماره تلفن' name='phone' value={inputField.phone} onChange={inputHandler} className={classes.examInfo__login_input} />
                                    <input type="password" placeholder='رمز عبور' name='password' value={inputField.password} onChange={inputHandler} className={classes.examInfo__login_input} style={{ marginBottom: "6px" }} />
                                    <p id={classes.forgetPassword} style={{ margin: "0px 0 16px 0" }}>فراموشی رمز عبور</p>
                                    <button type="submit" className={classes.examInfo__login_btn}>ورود</button>
                                    { verify.guest ? <p id={classes.forgetPassword} className={classes.examInfo__changeField} onClick={() => navigate(`/guest/join/${params.quiz}`)} >ورود به صورت مهمان</p> : <></>}
                                </form>
                            </div>
                        </div>
                        <div className={classes.examInfo__btn_container}>
                            <button onClick={() => examPageHandler()} className={classes.examInfo__btn}>شروع  آزمون و مشاهده سوالات</button>
                        </div>
                    </section>
                    :
                    <>
                        <Loading />
                    </>
                }
            </div>
        </div >
    );
}

export default ExamInfo;
