
import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import Swal from 'sweetalert2';
import classes from '../../App.module.scss';
import { useState, useEffect } from 'react';
import { confirmGuestLoginRequest, confirmMessageRequest, examDatails, getSchoolName, guestLoginPhone, guestVerification } from '../../assets/api/userActions';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../components/loading/loading';

function GuestLogin() {

    const params = useParams();
    const navigate = useNavigate();

    const [examData, setExamData] = useState();
    const [counter, setCounter] = useState(null);
    const [verify, setVerify] = useState();
    const [schoolName, setSchoolName] = useState("");
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
        if(data.status){
            Swal.fire({
                icon:"error",
                title:`${data.message}`
            })
        }
        else{
            console.log(data);
            const today = new Date()
            let tomorrow = new Date()
            const setExpireDate = tomorrow.setDate(today.getDate() + 1);
            localStorage.setItem("userToken", JSON.stringify({ quizToken: data.token, expireDate: setExpireDate, name: data.name ,user_id:data.user_id }))
            examPageHandler()
        }
    }

    const onSubmitLogin = async (res) => {

        // console.log(res);
        if (!res) {
            Swal.fire({
                icon: "error",
                title: "?????? ???????? ?????? ???????????? ??????",
                confirmButtonText: "????????"
            })
        }
        else {
            
            const today = new Date()
            let tomorrow = new Date()
            const setExpireDate = tomorrow.setDate(today.getDate() + 1);
            localStorage.setItem("userToken", JSON.stringify({ quizToken: res.quizToken, expireDate: setExpireDate, name: guestInputField.name }))
            examPageHandler()
        }
    }
    const onGuestSendLogin = async () => {
        
        if (!guestInputField.name) {
            Swal.fire({ icon: "error", title: "???????? ?????? ?????? ???? ??????????????" })
        }
        else if (!guestInputField.phone) {
            Swal.fire({ icon: "error", title: "???????? ?????????? ???? ??????????????" })
        }
        else if (!guestInputField.code) {
            Swal.fire({ icon: "error", title: "???????? ???? ?????????? ???? ??????????????" })
        }
        else {
            await confirmGuestLoginRequest({ ...guestInputField, quizCode: params.quiz }).then(res => onSubmitLogin(res));
        }
    }

    const onAuthGuestHandler = async (res) => {
        
        if (!guestInputField.name) {
            Swal.fire({ icon: "error", title: "???????? ?????? ?????? ???? ??????????????",confirmButtonText: "????????" })
        }
        else if (!guestInputField.phone) {
            Swal.fire({ icon: "error", title: "???????? ?????????? ???? ??????????????",confirmButtonText: "????????" })
        }
        else {
            let { code, ...newData } = guestInputField;
            newData = { ...newData, quiz_code: params.quiz };
            await guestLoginPhone(newData).then(res => successGuestLoginHandler(res));
        }
    }

    const validExamHandler = (data) => {
        if (!data.validation){
            navigate("/service/not-active");
        }
        else if (!data.guest) {
            
            navigate("/guest/not-active");
        }
    }

    const fetchGuestValidation = async () => {
        guestVerification(params.quiz).then(res => {setVerify(res);validExamHandler(res) });
    }


    const fetchSchoolName = async() => {
        await getSchoolName(params.quiz).then(res => setSchoolName(res.schoolName))
    }

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
            setExamData(data?.quiz)
            setIsLoading(false)
            return data?.quiz?.title;
        }
        return data?.quiz?.title;
    }


    useEffect(() => {
        let examTitle = fetchData();
        fetchGuestValidation();
        fetchSchoolName();
        examTitle.then(res =>  document.title = res === undefined ? `?????????????? ?????????? ???????? ??????????` : `?????????????? ?????????? ${res}`)
    }, [])

    const guestInputHandler = (e) => {
        setGuestInputField({ ...guestInputField, [e.target.name]: e.target.value });
    }




    const handleResultShow = () => {
        // examData?.show_result
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



    const handleSendNumber = async (res) => {
        // console.log(res);
        if (res.returnCode === "SUCCESS") {
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
                title: "?????? ?????? ???? ???????? ????????",
                confirmButtonText: "????????"
            })
        }
        else if (guestInputField.phone.length !== 11 && guestInputField.phone.length !== 0) {
            Swal.fire({
                icon: "error",
                title: "?????????? ???????? ?????? ???????? ??????????????",
                confirmButtonText: "????????"

            })
        }
        else if (!guestInputField.phone.length) {
            Swal.fire({
                icon: "error",
                title: "?????????? ?????? ???? ???????? ????????",
                confirmButtonText: "????????"
            })
        }
        else if (!regex.test(guestInputField.phone.toString())) {
            Swal.fire({
                icon: "error",
                title: "???????? ?????????? ???????? ?????? ???????? ??????????????",
                confirmButtonText: "????????"

            })
        }
        else {
            // console.log(params.quiz);
            await confirmMessageRequest(guestInputField.name, guestInputField.phone, params.quiz).then(res => handleSendNumber(res));
        }
    }

    const examPageHandler = async () => {
        if (examData?.type === "test" && examData?.question_type === "custom") {
            navigate(`/quiz/test/${params.quiz}`);
            window.location.reload();
        }
        else if (examData?.type === "test" && examData?.question_type === "pdf") {
            navigate(`/quiz/test-pdf/${params.quiz}`);
            window.location.reload();
        }
        else if (examData?.type === "descriptive" && examData?.question_type === "custom") {
            navigate(`/quiz/descriptive/${params.quiz}`);
            window.location.reload();
        }
        else if (examData?.type === "descriptive" && examData?.question_type === "pdf") {
            navigate(`/quiz/descriptive-pdf/${params.quiz}`);
            window.location.reload();
        
        }
    }


    return (
        <div className={classes.appContainer} style={{ minHeight: "100vh", height: "100%" }}>
            <div className={classes.container}>
                {!isLoading ?
                    <section className={classes.questionSection}>
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
                            <div className={classes.examInfo__login_section} style={{ display: "flex" }}>
                                <div className={classes.examInfo__login} >
                                    <div className={classes.examInfo__login_title}>
                                        <h3>???????? ??????????</h3>
                                    </div>
                                    <div className={classes.examInfo__login_title}>
                                        <p className={classes.examInfo__login_info}>???????? ???????? ???????? ???????????? ?????? ????????</p>
                                    </div>
                                    <input type="text" placeholder='?????? ?? ?????? ????????????????' name='name' value={guestInputField.name} onChange={guestInputHandler} className={classes.examInfo__login_input} />
                                    <input type="number" placeholder='?????????? ????????' name='phone' value={guestInputField.phone} onChange={guestInputHandler} className={classes.examInfo__login_input} />
                                    {isClickedOnSentPassword && <input type="number" autoComplete="new-password" placeholder='?????? ?????????? ??????' name='code' value={guestInputField.code} onChange={guestInputHandler} className={classes.examInfo__login_input} style={{ marginBottom: "6px" }} />}
                                    {isClickedOnSentPassword && !showMessage && <p id={classes.resendMessage}>{`${counter} ?????????? ?????????? ???? ???????????? ???? ????????`}</p>}
                                    {showMessage && <p id={classes.forgetPassword} className={classes.examInfo__changeField} onClick={() => onGuestSendPhone()} >?????????? ???????????? ?????????? ?????? ??<br />?????????? ???????? ????</p>}
                                    {
                                        verify.guestDetection ?
                                            isClickedOnSentPassword ?
                                                <button className={classes.examInfo__login_btn} onClick={() => onGuestSendLogin()} >????????</button>
                                                :
                                                <button className={classes.examInfo__login_btn} onClick={() => onGuestSendPhone()} >?????????? ?????? ????????</button>
                                            :

                                            <button className={classes.examInfo__login_btn} onClick={() => onAuthGuestHandler()} >????????</button>

                                    }
                                    {/* <p id={classes.forgetPassword} className={classes.examInfo__changeField} onClick={() => navigate(`/quiz/join/${params.quiz}`)} >???????? ??????????</p> */}
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
