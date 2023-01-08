import React, { useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { postFilePath, postFormData, postUserDescriptionAnswer, storeFileURL } from '../../assets/api/userActions';

import { getFileName } from '../../assets/utils/utils';

import { ReactComponent as Delete } from '../../assets/icons/Delete.svg';
import { ReactComponent as Load } from '../../assets/icons/loading.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';
import Swal from 'sweetalert2';

const BackDrop = (props) => {
    return <div className={classes.modalBackDrop} onClick={props.onConfirm} ></div>
}

const OverlayUploadModal = (props) => {

    const ref = useRef();
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)
    const [resAnswer, setResAnswer] = useState([])
    const [userAnswer, setUserAnswer] = useState("")


    const updateButtonName = (url) => {
        const pathName = getFileName(url)
        props.uploadFileName(pathName);
    }



    const formDataRes = async (res) => {
        const data = await postUserDescriptionAnswer(props.id, props.attemptID, userAnswer);
        const fileURLData = {
            path: res.path, //"res.path"
            answer_id: data.created_answer.id,//id
            driver: "ftp",
            type: "open",
        };
        for ( let el of data.attempt.answers ){
            if(el.question_id === props.id) props.setBodyData(el.answer)
        }
        // console.log(fileURLData);    1
        const fileUrlResp = await storeFileURL(fileURLData);
        setLoading(false);
        console.log("storeFileURL =>", fileUrlResp);
        console.log("abc");
        props.uploadSuccess();
        setTimeout(() => updateButtonName(res), 1000);
        props.onConfirm();
    }
    
    const nullFormDataRes = async (res) => {
        const data = await postUserDescriptionAnswer(props.id, props.attemptID, userAnswer);
        // console.log(props.id);
        console.log(data.attempt.answered_questions);
        console.log(data.attempt.unanswered_questions);
        props.answerAttemptRes({answered_questions:data.attempt.answered_questions,
            unanswered_questions:data.attempt.unanswered_questions})
        // setResAnswer(data.attempt.answered_questions)
        for ( let el of data.attempt.answers ){
            if(el.question_id === props.id) props.setBodyData(el.answer)
        }
        // props.setBodydata(data.attempt.answers)
        props.uploadSuccess();
        setLoading(false);
        setTimeout(() => props.uploadFileName("پاسخ تشریحی ثبت شد."), 1000);
        props.onConfirm();
    }

    const onSubmitClick = async (e) => {
        e.preventDefault();
        setLoading(true);
        // props.clickedOnFunc()
        if (file) {
            // console.log("a");
            const dataFile = new FormData();
            dataFile.append("file", file);
            await postFormData(dataFile).then(res => { formDataRes(res.data); console.log("file done"); })
        }
        else if (!file && userAnswer) {
            // console.log("b");
            await nullFormDataRes();
        }
        else if (!file || !userAnswer) {
            Swal.fire({
                icon: "warning",
                title: "برای ثبت پاسخ, جواب را تایپ  یا فایل ارسال کنید",
                confirmButtonText: "باشه"
            });
            setLoading(false);
        }

    };


    const userAnswerHandler = (event) => {
        setUserAnswer(event.target.value)
    }

    const answeredHandler = (data,isUserTyped) => {
        if(isUserTyped){
            for( let el of data ){
                console.log(el.question_id);
            }
        }
        else setUserAnswer(data);
    }

    const onFileChangeHandler = (event) => {
        setFile(event.target.files[0]);
        // console.log(event.target.files[0]);
    }

    const onFileDeleteHandler = () => {
        ref.current.value = "";
    }
    useEffect(() => {
        // console.log(resAnswer);
        // if(props.answers) answeredHandler(props.answers,true) 
        props.body && answeredHandler(props.body)
    }, [])
    // document.getElementById("file-upload-button").setAttribute("value","nigga")



    return (
        <form className={classes.answerModal} onSubmit={onSubmitClick} key={props.id}>
            <p className={classes.answerModal_header}>{`پاسخ سوال ${props.quNo} :`}</p>
            <textarea className={classes.answerModal_textarea} value={userAnswer} onChange={userAnswerHandler} placeholder='اینجا بنویسید :'></textarea>
            <div className={classes.answerModal_footer}>
                <div className={classes.answerModal_footer__uploadBtn}>
                    {/* <label htmlFor="inputFileValue">
                        <span>آپلود فایل</span>
                    </label> */}
                    <input type='file' ref={ref} name="inputFileValue" id={classes.uploadBtn} accept="image/* ,application/pdf" onChange={onFileChangeHandler} />
                    {/* <button id={classes.uploadBtn}  onClick={onButtonClick}>آپلود عکس جواب</button>  */}
                    <div className={classes.uploadDetails} onClick={() => onFileDeleteHandler()}>
                        {/* <p>{`image.jpg`}</p> */}
                        <Delete />
                    </div>
                </div>
                { loading ? <div id={classes.loadingBtn}><Load height={"30"}/></div> :
                <button type='submit' style={{ border: 'none' }} id={classes.confirmBtn}>ثبت پاسخ</button>}
            </div>
        </form>
    )
}
const UploadModal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(<BackDrop onConfirm={props.onConfirm} />, document.getElementById("backdrop-root"))}
            {ReactDOM.createPortal(<OverlayUploadModal id={props.id} uploadSuccess={props.uploadSuccess} answerAttemptRes={props.answerAttemptRes}
                uploadFileName={props.uploadFileName} attemptID={props.attemptID} quNo={props.quNo} clickedOnFunc={props.clickedOnFunc}
                body={props.body} setBodyData={props.setBodyData}
                onConfirm={props.onConfirm} />, document.getElementById("overlayUploadModal-root"))}
        </React.Fragment>
    )
}

export default UploadModal;