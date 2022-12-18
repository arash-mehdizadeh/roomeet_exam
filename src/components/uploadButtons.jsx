import { useState } from 'react';

import UploadModal from '../components/modal/uploadModal'

import { ReactComponent as Arrow } from '../assets/icons/left_arrow.svg';

import classes from '../styles/components/uploadButtons.module.scss'
import { useEffect } from 'react';
import { getFileName, getFileNameFromAttempt } from '../assets/utils/utils';


const UploadButtons = ({ index ,quNo , userAnswered, attemptID, score, activeBtn, activeBtnHandler, nullingActiveBtnHandler }) => {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [body, setBody] = useState("")
    const [buttonValue, setButtonValue] = useState("(کلیک کنید)")

    const modalHandler = () => {
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

    const userAnsweredHandler = (qid) => {
        // console.log(userAnswered)
        // console.log(qid)
        for (var i = 0; i < userAnswered?.length; i++) {
            if (qid === userAnswered[i]?.id) {
                console.log(userAnswered[i])
                // let userDate = userAnswered[i];
                userAnswered[i]?.file_url && uploadFileName(getFileNameFromAttempt(userAnswered[i].file_url))
                userAnswered[i].answer  && setBody(getFileNameFromAttempt(userAnswered[i].answer))
            }
        }
    }

    useEffect(() => {
        userAnswered && userAnsweredHandler(index);
    }, [])

    return (

        // <li className={classes.uploadRow}>
        <li key={index} className={classes.uploadButtonRow}>
            {
                isModalOpen &&
                <UploadModal id={index} quNo={quNo} body={body} attemptID={attemptID} onConfirm={modalHandler} uploadSuccess={uploadSuccess} uploadFileName={uploadFileName} />
            }
            <div className={classes.uploadContainer} >
                {/*when upload was successful `successUpload` class will active / and when user click on button active_uploadBtn will active */}
                <div className={`${classes.uploadBtn_container} ${activeBtn === index && classes.active_uploadBtn}`} onClick={() => { setIsModalOpen(true); activeBtnHandler(index) }}>
                    <p className={` ${classes.uploadBtn} uploadBtn-${index} `}>{buttonValue}</p>
                    <Arrow className={`${classes.arrow} ${activeBtn === index && classes.active_arrow} `} /> {/* when user click on bitten `active_arrow` class will appear */}
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