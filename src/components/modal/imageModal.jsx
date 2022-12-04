import React from 'react';
import ReactDOM from 'react-dom';

import { ReactComponent as Cancel } from '../../assets/icons/cancel.svg';

import classes from '../../styles/components/modals/uploadModal.module.scss';

const BackDrop = (props) => {
    return <div className={`${classes.modalBackDrop} ${classes.modalBackDropShadow}`} onClick={props.onConfirm} ></div>
}

const OverlayImageModal = (props) => {
    return (
        <div className={classes.imageModal}>
            <div className={classes.imageModal__container}>
                <div className={classes.imageModal__cancel_btn} onClick={()=>props.onConfirm()} >
                    <Cancel  width="32px" height="32px" />
                </div>
                <div className={classes.imageModal__image_container}>
                    <img src={props.imageURL} alt="" className={classes.image} />
                </div>
            </div>
        </div>
    )
}

const ImageModal = (props) => {
    return (
        <React.Fragment>
            {ReactDOM.createPortal(<BackDrop onConfirm={props.onConfirm} />, document.getElementById("backdrop-root"))}
            {ReactDOM.createPortal(<OverlayImageModal id={props.id} imageURL={props.imageURL}
                onConfirm={props.onConfirm} />, document.getElementById("overlayImageModal-root"))}
        </React.Fragment>
    )
}

export default ImageModal;