
import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import Swal from 'sweetalert2';
import classes from '../../App.module.scss';
import { useState, useEffect } from 'react';
import { attemptToJoinExam, examDatails, getSchoolName, guestVerification, userLogin } from '../../assets/api/userActions';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Loading from '../../components/loading/loading';

function ExamInfo() {

    const [searchParams] = useSearchParams();
    const params = useParams();
    const navigate = useNavigate();
    const [verify, setVerify] = useState();
    const [schoolName, setSchoolName] = useState("");
    const [examData, setExamData] = useState();
    const [isUserLogged, setIsUserLogged] = useState(false)
    const [isLoading, setIsLoading] = useState(true)


    const [inputField, setInputField] = useState({
        phone: "",
        password: ""
    });


    const validExamHandler = (data) => {
        if (!data.validation) {
            navigate("/service/not-active");
        }
    }

    const fetchGuestValidation = async () => {
        // console.log("aaa");
        await guestVerification(params.quiz).then(res => { setVerify(res); validExamHandler(res) });
    }

    function isInThePast(date) {
        const today = new Date();
        return date < today;
    }

    const today = new Date()
    let tomorrow = new Date()
    const setExpireDate = tomorrow.setDate(today.getDate() + 1);

    const fetchSchoolName = async () => {
        await getSchoolName(params.quiz).then(res => setSchoolName(res.schoolName))
    }

    const fetchData = async () => {
        const data = await examDatails(params.quiz)
        if (data.status === "not-found") {
            Swal.fire({
                icon: "error",
                title: `${data.message}`
            })

        }
        else {
            setExamData(data);
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
        fetchSchoolName();
        let examTitle = fetchData();
        examTitle.then(res => document.title = res === undefined ? `?????????????? ?????????? ???????? ??????????` : `?????????????? ?????????? ${res}`)
    }, [])
    const LS_data = JSON.parse(localStorage.getItem("userToken"))
    const inputHandler = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value });
    }




    const handleResultShow = () => {
        if (examData?.show_result === "range") {
            return <>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>?????????? ?????????????? ????????  ???? ??????????:</p>
                    <p className={classes.examInfo__detail}>{examData?.show_result_from.replace(" ", " ???? ???????? ")}</p>
                </div>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>?????????? ?????????????? ????????  ???? ??????????:</p>
                    <p className={classes.examInfo__detail}>{examData?.show_result_to.replace(" ", " ???? ???????? ")}</p>
                </div>
            </>
        }
        else if (examData?.show_result === "no_display") {
            return <>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>?????????? ?????????????? ????????:</p>
                    <p className={classes.examInfo__detail}>?????? ??????????</p>
                </div>
            </>
        }
        else {
            return <>
                <div className={classes.examInfo__info_container}>
                    <p className={classes.examInfo__title}>?????????? ?????????????? ????????:</p>
                    <p className={classes.examInfo__detail}>???? ???? ?????????? ??????????</p>
                </div>
            </>
        }
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        const userData = await userLogin(inputField);
        console.log(userData);
        var regex = new RegExp('^(\\+98|0)?9\\d{9}$');
        if (inputField.phone.length !== 11 && inputField.phone.length !== 0) {
            Swal.fire({
                icon: "error",
                title: "?????????? ???????? ?????? ???????? ??????????????",
                confirmButtonText: "????????"

            })
        }
        else if (!inputField.phone.length) {
            Swal.fire({
                icon: "error",
                title: "?????????? ?????? ???? ???????? ????????",
                confirmButtonText: "????????"
            })
        }
        else if (!regex.test(inputField.phone.toString())) {
            Swal.fire({
                icon: "error",
                title: "???????? ?????????? ???????? ?????? ???????? ??????????????",
                confirmButtonText: "????????"

            })
        }
        else if (userData.customCode) {
            Swal.fire({
                icon: "error",
                title: `${userData.error}`,
            })
        }
        else{
            const { token, ...newUserData } = userData;
            localStorage.setItem("userToken", JSON.stringify({
                ...newUserData, userToken: token, "expireDate": setExpireDate
            }))
            window.location.reload();
        }

    }


    const examPageHandler = async () => {
        let data = JSON.parse(localStorage.getItem('userToken'));
        if (data) {
            let res = await attemptToJoinExam(params.quiz, data.quizToken)
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
                title: `???????? ???????? ???? ?????????? ???????? ???????? ???????????? ??????????`,
                confirmButtonText: "????????"
            })
        }
    }

    return (
        <div className={classes.appContainer} style={{ minHeight: "100vh", height: "100%" }}>
            <div className={classes.container}>
                {!isLoading ?
                    <section section className={classes.questionSection} style={{maxWidth:"unset"}}>
                        <div className={classes.questionSection_header} style={{ alignItems: "center" }}>
                            <h2>?????????????? ??????????</h2>
                            <div id={classes.returnBtn}>
                                <p>???????????? ???? ????????</p>
                                <div className={classes.exitIcon}>
                                    <Exit fill='#fff' width="15px" height='15px' />
                                </div>
                            </div>
                        </div>
                        <div className={`${classes.questionContainer} ${classes.examInfo__container}`} >
                            {
                                <div style={{ width: "100%" }} key={examData?.id}>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????? ???????? ?????????? :</p>
                                        <p className={classes.examInfo__detail}>{isUserLogged ? LS_data.name : "???????? ???????? ???????????? ?????? ???????? ??????."}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????? ???????????????? :</p>
                                        <p className={classes.examInfo__detail}>{schoolName}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????????? ?????????? :</p>
                                        <p className={classes.examInfo__detail}>{examData?.title}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????????? ???????????? :</p>
                                        <p className={classes.examInfo__detail}>{examData?.number_of_question}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????? ?????????? :</p>
                                        <p className={classes.examInfo__detail}>{examData?.type == "test" ? "??????" : "????????????"}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>???????? ???????? ?????? :</p>
                                        <p className={classes.examInfo__detail}>{examData?.negative_point ? examData?.negative_point : "??????????"}</p>
                                    </div>
                                    {
                                        examData?.date &&
                                        <div className={classes.examInfo__info_container}>
                                            <p className={classes.examInfo__title}>?????????? ???????? ?????????? :</p>
                                            <p className={classes.examInfo__detail}>{examData?.date}</p>
                                        </div>
                                    }
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>???????? ?? ???????? ?????????? :</p>
                                        {examData?.start_time_from == null ? <p className={classes.examInfo__detail}>???? ??????????</p> :
                                            <p className={classes.examInfo__detail}>{`${examData?.start_time_from} ???? ${examData?.start_time_to}`}</p>}
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????????? ?????????? :</p>
                                        <p className={classes.examInfo__detail}>{`${examData?.duration ? examData?.duration + " ?????????? ?????? ???? ???????? ??????????" : "??????????????"}`}</p>
                                    </div>
                                    {
                                        handleResultShow()
                                    }

                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>?????????? ?????? ?????????? :</p>
                                        <p className={classes.examInfo__detail}>{examData?.leave == 0 ? "??????????" : "????????"}</p>
                                    </div>
                                    <div className={classes.examInfo__info_container}>
                                        <p className={classes.examInfo__title}>???????? ???????? ?????????? :</p>
                                        <p className={classes.examInfo__detail}>{examData?.active == 0 ? "?????? ????????" : "????????"}</p>
                                    </div>
                                </div>
                                // ))
                            }
                            <div className={classes.examInfo__login_section} style={{ display: isUserLogged ? "none" : "flex" }}>
                                <form className={classes.examInfo__login} onSubmit={onSubmitHandler} >
                                    <div className={classes.examInfo__login_title}>
                                        <h3>????????</h3>
                                    </div>
                                    <div className={classes.examInfo__login_title}>
                                        <p className={classes.examInfo__login_info}>???????? ???????? ???????? ???????????? ?????? ????????</p>
                                    </div>
                                    <input type="number" placeholder='?????????? ????????' name='phone' value={inputField.phone} onChange={inputHandler} className={classes.examInfo__login_input} />
                                    <input type="password" placeholder='?????? ????????' name='password' value={inputField.password} onChange={inputHandler} className={classes.examInfo__login_input} style={{ marginBottom: "6px" }} />
                                    <p id={classes.forgetPassword} style={{ margin: "0px 0 16px 0" }}>?????????????? ?????? ????????</p>
                                    <button type="submit" className={classes.examInfo__login_btn}>????????</button>
                                    {verify.guest ? <p id={classes.forgetPassword} className={classes.examInfo__changeField} onClick={() => navigate(`/guest/join/${params.quiz}`)} >???????? ???? ???????? ??????????</p> : <></>}
                                </form>
                            </div>
                        </div>
                        <div className={classes.examInfo__btn_container}>
                            <button onClick={() => examPageHandler()} className={classes.examInfo__btn}>????????  ?????????? ?? ???????????? ????????????</button>
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
