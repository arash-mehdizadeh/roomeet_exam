import React, { useRef } from 'react'
import ReactDOM from 'react-dom';

import { ReactComponent as Delete } from '../../assets/icons/Delete.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';

const BackDrop = (props) => {
    return <div className={classes.modalBackDrop} onClick={props.onConfirm} ></div>
}

const OverlayUploadModal = (props) => {
    const inputFile = useRef(null);
    const onButtonClick = () => {
        // `current` points to the mounted file input element
        inputFile.current.click();
    };

    return (
        <div className={classes.answerModal}>
            <p className={classes.answerModal_header}>{`پاسخ سوال ${props.questionNo} :`}</p>
            <textarea className={classes.answerModal_textarea} placeholder='اینجا بنویسید :'></textarea>
            <div className={classes.answerModal_footer}>
                <div className={classes.answerModal_footer__uploadBtn}>
                    <input type='file' ref={inputFile} style={{display:'none'}}/>
                    <button id={classes.uploadBtn}  onClick={onButtonClick}>آپلود عکس جواب</button>
                    <div className={classes.uploadDetails}>
                        <p>{`image.jpg`}</p>
                        <Delete />
                    </div>
                </div>
                <div id={classes.confirmBtn}>ثبت پاسخ</div>
            </div>
        </div>
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