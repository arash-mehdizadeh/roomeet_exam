import React, { useRef, useState } from 'react'
import ReactDOM from 'react-dom';
import { postFormData } from '../../assets/api/userActions';

import { ReactComponent as Delete } from '../../assets/icons/Delete.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';

const BackDrop = (props) => {
    return <div className={classes.modalBackDrop} onClick={props.onConfirm} ></div>
}

const OverlayUploadModal = (props) => {
    
    const ref = useRef();
    const [file, setFile] = useState( null )
    const [fileURL, setFileURl] = useState( null )

    const onSubmitClick = async (e) => {
        e.preventDefault();
        const dataFile = new FormData();
        dataFile.append("file", file);
        // var formHeaders = dataFile.getHeaders();
        await postFormData(dataFile).then( res =>{ setFileURl(res);console.log(res.data);})
        // 'https://quiz-api.roomeet.ir/upload/files/pdf/2022/11/ftp_1668707199_dummy.pdf'
    };


    const onFileChangeHandler = (event) => {
        setFile(event.target.files[0]);
        console.log(event.target.files[0]);
    }
    
    
    const onFileDeleteHandler = () => {
        ref.current.value = "";
    }

    // document.getElementById("file-upload-button").setAttribute("value","nigga")



    return (
        <form className={classes.answerModal} onSubmit={onSubmitClick}>
            <p className={classes.answerModal_header}>{`پاسخ سوال ${props.questionNo} :`}</p>
            <textarea className={classes.answerModal_textarea} placeholder='اینجا بنویسید :'></textarea>
            <div className={classes.answerModal_footer}>
                <div className={classes.answerModal_footer__uploadBtn}>
                    <label htmlFor="inputFileValue">
                        <span>آپلود فایل</span>
                    </label>
                    <input type='file' ref={ref} name="inputFileValue" id={classes.uploadBtn} onChange={onFileChangeHandler} />
                    {/* <button id={classes.uploadBtn}  onClick={onButtonClick}>آپلود عکس جواب</button>  */}
                    <div className={classes.uploadDetails} onClick={() => onFileDeleteHandler()}>
                        {/* <p>{`image.jpg`}</p> */}
                        <Delete />
                    </div>
                </div>
                <button type='submit' style={{border:'none'}}  id={classes.confirmBtn}>ثبت پاسخ</button>
            </div>
        </form>
    )
}
const UploadModal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(<BackDrop onConfirm={props.onConfirm} />, document.getElementById("backdrop-root"))}
            {ReactDOM.createPortal(<OverlayUploadModal questionNo={props.questionNo} onConfirm={props.onConfirm} />, document.getElementById("overlayUploadModal-root"))}
        </React.Fragment>
    )
}

export default UploadModal;