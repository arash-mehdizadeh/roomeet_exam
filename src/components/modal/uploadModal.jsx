import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { postFilePath, postFormData, postUserDescriptionAnswer, storeFileURL } from '../../assets/api/userActions';

import { getFileName } from '../../assets/utils/utils';

import { ReactComponent as Delete } from '../../assets/icons/Delete.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';
import { useEffect } from 'react';

const BackDrop = (props) => {
    return <div className={classes.modalBackDrop} onClick={props.onConfirm} ></div>
}

const OverlayUploadModal = (props) => {

    const ref = useRef();
    const [file, setFile] = useState(null)
    const [fileURL, setFileURl] = useState("")
    const [userAnswer, setUserAnswer] = useState("")


    // const fileURLData = {
    //     path: fileURL, 
    //     answer_id : props.id,//id
    //     driver : "ftp",
    //     type : "open",
    // }


    const updateButtonName = (url) => {
        // console.log(url);
        const pathName = getFileName(url)
        // const lastIndex = data.path.split("/").pop();
        // const fileName =  lastIndex.split("_").pop();
        props.uploadFileName(pathName);
    }

    const formDataRes = async (res) => {
        // console.log(res.path);
        const resp = await postUserDescriptionAnswer(props.id, props.attemptID, userAnswer);
        console.log("questionAnswerData =>", resp);
        const fileURLData = {
            path: res.path, //"res.path"
            answer_id: resp.created_answer?.id,//id
            driver: "ftp",
            type: "open",
        };


        const aaa = await storeFileURL(fileURLData);
        console.log("storeFileURL =>", aaa);
        props.uploadSuccess();
        setTimeout(() => updateButtonName(res), 1000);
        props.onConfirm();
        // postFilePath(res.path , )
    }

    const onSubmitClick = async (e) => {
        e.preventDefault();
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
        console.log(event.target.files[0]);
    }

    const onFileDeleteHandler = () => {
        ref.current.value = "";
    }
    useEffect(() => {
        props.body && answeredHandler(props.body)
    }, [])
    // document.getElementById("file-upload-button").setAttribute("value","nigga")



    return (
        <form className={classes.answerModal} onSubmit={onSubmitClick}>
            <p className={classes.answerModal_header}>{`پاسخ سوال ${props.id} :`}</p>
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
                uploadFileName={props.uploadFileName} attemptID={props.attemptID}
                body={props.body}
                onConfirm={props.onConfirm} />, document.getElementById("overlayUploadModal-root"))}
        </React.Fragment>
    )
}

export default UploadModal;