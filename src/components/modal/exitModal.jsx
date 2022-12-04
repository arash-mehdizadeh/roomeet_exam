import React from 'react';
import ReactDOM from 'react-dom';
import { useNavigate, useParams } from 'react-router-dom';
import { finishExam, leaveExam } from '../../assets/api/userActions';

import { ReactComponent as Cancel } from '../../assets/icons/cancel.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';

const BackDrop = (props) => {
    return <div className={`${classes.modalBackDrop} ${classes.modalBackDropShadow}`} onClick={props.onConfirm} ></div>
}

const OverlayConfirmExitModal = (props) => {

    const navigate = useNavigate();
    const params = useParams();

    const onConfirm = async () => {
        if (props.leave) {
            console.log("1");
            let res = await leaveExam(props.attemptID);
            console.log(res);
            if (res.status === "success-leave") {
                navigate("/quiz/join/" + params.quiz)
            }
        }
        else {
            console.log("2");
            let res = await finishExam(props.attemptID);
            console.log(res);
            if (res.status === "success-finish") {
                navigate("/quiz/finish")
            }
        }

    }

    return (
        <div className={classes.imageModal} style={{ width: '44%', top: "20%" }}>
            <div className={classes.imageModal__container}>
                <div className={classes.imageModal__cancel_btn} onClick={props.onClose} >
                    <Cancel width="32px" height="32px" />
                </div>
                <div className={classes.confirmModal}>
                    {
                        props.leave ?
                            <p className={classes.confirmModal__title}>{`آیا میخواهید آزمون را ترک کنید ؟`}</p> :
                            <p className={classes.confirmModal__title}>{`آیا میخواهید آزمون را تمام کنید ؟`}</p>
                    }
                    <div className={classes.confirmModal__btn_container}>
                        <div className={classes.confirmModal__cancel_btn} onClick={props.onClose} >انصراف</div>
                        <div className={classes.confirmModal__confirm_btn} onClick={props.onConfirm} >تایید</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const ExitModal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(<BackDrop onClose={props.onClose} />, document.getElementById("backdrop-root"))}
            {ReactDOM.createPortal(<OverlayConfirmExitModal onConfirm={props.onConfirm} onClose={props.onClose}
                leave={props.leave} />, document.getElementById("overlayConfirmExitModal-root"))}
        </React.Fragment>
    )
}

export default ExitModal;