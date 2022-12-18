import React, { useRef, useState, useEffect } from 'react'
import ReactDOM from 'react-dom';
import { postFilePath, postFormData, postUserDescriptionAnswer, storeFileURL } from '../../assets/api/userActions';

import { getFileName } from '../../assets/utils/utils';

import { ReactComponent as Delete } from '../../assets/icons/Delete.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';
import Swal from 'sweetalert2';

const BackDrop = (props) => {
    return <div className={classes.modalBackDrop} onClick={props.onConfirm} ></div>
}

const OverlayUploadModal = (props) => {

    const ref = useRef();
    const [file, setFile] = useState(null)
    const [ questionID, setQuestionID] = useState(null)
    // const [fileURL, setFileURl] = useState("")
    const [userAnswer, setUserAnswer] = useState("")

    const updateButtonName = (url) => {
        const pathName = getFileName(url)
        props.uploadFileName(pathName);
    }



    const formDataRes = async (res) => {
        const data = await postUserDescriptionAnswer(props.id, props.attemptID, userAnswer);
        // response_answer.then(res => console.log(res))
        console.log(data);
        const fileURLData = {
            path: res.path, //"res.path"
            answer_id: data.created_answer.id,//id
            driver: "ftp",
            type: "open",
        };
        // console.log(fileURLData);
        const fileUrlResp = await storeFileURL(fileURLData);
        console.log("storeFileURL =>", fileUrlResp);
        props.uploadSuccess();
        setTimeout(() => updateButtonName(res), 1000);
        props.onConfirm();
    }

    const nullFormDataRes = async (res) => {
        const data = await postUserDescriptionAnswer(props.id, props.attemptID, userAnswer);
        const nullFileURLData = {
            path: null, //"res.path"
            answer_id: data.created_answer.id,//id
            driver: "ftp",
            type: "open",
        };
        const aaa = await storeFileURL(nullFileURLData);
        console.log(aaa);
        props.uploadSuccess();
        setTimeout(() => props.uploadFileName("پاسخ تشریحی ثبت شد."), 1000);
        props.onConfirm();
    }

    const onSubmitClick = async (e) => {
        e.preventDefault();
        if (file) {
            const dataFile = new FormData();
            dataFile.append("file", file);
            await postFormData(dataFile).then(res => { formDataRes(res.data);console.log("file done"); })
        }
        else if (!file && userAnswer) {
            await nullFormDataRes();
        }
        else if (!file || !userAnswer) {
            Swal.fire({
                icon: "warning",
                title: "برای ثبت پاسخ, جواب را تایپ  یا فایل ارسال کنید",
                confirmButtonText: "باشه"
            })
        }
        const dataFile = new FormData();
        dataFile.append("file", file);
        // var formHeaders = dataFile.getHeaders();
        await postFormData(dataFile).then(res => { formDataRes(res.data) }) //added uploadSuccess and log in there
        // const res = await postUserAnswer(questionAnswerData);
        // console.log("questionAnswerData =>",res);
        // 'https://quiz-api.roomeet.ir/upload/files/pdf/2022/11/ftp_1668707199_dummy.pdf'

    };


    const userAnswerHandler = (event) => {
        setUserAnswer(event.target.value)
    }

    const answeredHandler = (data) => {
        setUserAnswer(data)
    }

    const onFileChangeHandler = (event) => {
        setFile(event.target.files[0]);
        // console.log(event.target.files[0]);
    }

    const onFileDeleteHandler = () => {
        ref.current.value = "";
    }
    useEffect(() => {
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
                    <input type='file' ref={ref} name="inputFileValue" id={classes.uploadBtn} onChange={onFileChangeHandler} />
                    {/* <button id={classes.uploadBtn}  onClick={onButtonClick}>آپلود عکس جواب</button>  */}
                    <div className={classes.uploadDetails} onClick={() => onFileDeleteHandler()}>
                        {/* <p>{`image.jpg`}</p> */}
                        <Delete />
                    </div>
                </div>
                <button type='submit' style={{ border: 'none' }} id={classes.confirmBtn}>ثبت پاسخ</button>
            </div>
        </form>
    )
}
const UploadModal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(<BackDrop onConfirm={props.onConfirm} />, document.getElementById("backdrop-root"))}
            {ReactDOM.createPortal(<OverlayUploadModal id={props.id} uploadSuccess={props.uploadSuccess}
                uploadFileName={props.uploadFileName} attemptID={props.attemptID} quNo={props.quNo}
                body={props.body}
                onConfirm={props.onConfirm} />, document.getElementById("overlayUploadModal-root"))}
        </React.Fragment>
    )
}

export default UploadModal;