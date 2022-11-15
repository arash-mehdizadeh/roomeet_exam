
import { ReactComponent as Exit } from '../../assets/icons/exit.svg';

import classes from '../../App.module.scss';
import { useState, useEffect } from 'react';
import { examDatails, userLogin } from '../../assets/api/userActions';
import { useNavigate, useParams } from 'react-router-dom';

function ExamInfo() {

    const params = useParams();
    const navigate = useNavigate();

    const [examData, setExamData] = useState();
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
    tomorrow.setDate(today.getDate() + 1)
    //returns the tomorrow date
    // console.log("tomorrow => ", tomorrow)
    console.log(isInThePast(tomorrow));
    const fetchData = async () => {
        const data = await examDatails(params.quiz_id)
        console.table(data);
        setExamData(data)
    }


    useEffect(() => {
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (data) {
            setIsUserLogged(true);
        }
        console.log(fetchData());
    }, [])

    const inputHandler = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value });
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const userData = await userLogin(inputField);
        localStorage.setItem("userToken", JSON.stringify(userData))
        window.location.reload();
    }

    const examPageHandler = () => {
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (data) {
            if (examData?.type == "test" && examData?.question_type == "custom") {
                navigate(`/quiz/test/${params.quiz_id}`);
            }
            if (examData?.type == "test" && examData?.question_type == "pdf") {
                navigate(`/quiz/test-pdf/${params.quiz_id}`);
            }
            if (examData?.type == "descriptive" && examData?.question_type == "custom") {
                navigate(`/quiz/descriptive/${params.quiz_id}`);
            }
            if (examData?.type == "descriptive" && examData?.question_type == "pdf") {
                navigate(`/quiz/descriptive-pdf/${params.quiz_id}`);
            }
        }
        else {
            alert("برای ورود به آزمون وارد حساب کاربری بشوید")
        }
        // question_type
        //type
    }

    return (
        <div className={classes.appContainer} style={{ padding: "50px 230px" }}>
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
                                    <p className={classes.examInfo__detail}>{examData?.negative_point}</p>
                                </div>
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>شروع و ورود آزمون :</p>
                                    <p className={classes.examInfo__detail}>{examData?.start_time_from}</p>
                                </div>
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>پایان آزمون :</p>
                                    <p className={classes.examInfo__detail}>{`${examData?.duration} دقیقه بعد از شروع آزمون`}</p>
                                </div>
                                <div className={classes.examInfo__info_container}>
                                    <p className={classes.examInfo__title}>نمایش کارنامه تستی :</p>
                                    <p className={classes.examInfo__detail}>{examData?.show_result_from}</p>
                                </div>
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
