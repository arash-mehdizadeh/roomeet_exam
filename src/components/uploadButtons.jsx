import { useState } from 'react';

import UploadModal from '../components/modal/uploadModal'

import { ReactComponent as Arrow } from '../assets/icons/left_arrow.svg';

import classes from '../styles/components/uploadButtons.module.scss'


const UploadButtons = ({index, options , attemptID , score, activeBtn ,activeBtnHandler ,nullingActiveBtnHandler}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [buttonValue, setButtonValue] = useState("(کلیک کنید)")
    const uploadSuccessText = "عکس آپلود شد";

    const modalHandler = () =>{
        nullingActiveBtnHandler()
        setIsModalOpen(prev => !prev)
    }


    const uploadSuccess = () => {
        setButtonValue("فایل آپلود شد");
        // setButtonValue(uploadSuccessText)
    }
    
    
    const uploadFileName = (fileName) => {
        setButtonValue(fileName);
        // setButtonValue(uploadSuccessText)
    }


    return (

        // <li className={classes.uploadRow}>
        <li key={index} >
            {
                isModalOpen && 
                <UploadModal id={index} attemptID={attemptID} onConfirm={modalHandler} uploadSuccess={uploadSuccess} uploadFileName={uploadFileName} />
            }
            <div className={classes.uploadContainer} >
                {/*when upload was successful `successUpload` class will active / and when user click on button active_uploadBtn will active */}
                <div className={`${classes.uploadBtn_container} ${ activeBtn === index && classes.active_uploadBtn}`} onClick={()=>{setIsModalOpen(true);activeBtnHandler(index)}}>
                    <p className={` ${classes.uploadBtn} uploadBtn-${index} `}>{buttonValue}</p>
                    <Arrow className={`${classes.arrow} ${ activeBtn === index && classes.active_arrow } `} /> {/* when user click on bitten `active_arrow` class will appear */}
                </div>
                <div className={classes.grade}>
                    <div>{score}</div>
                    <div>بارم</div>
                </div>
            </div>
        </li>
        // </li>
    )
}



export default UploadButtons;