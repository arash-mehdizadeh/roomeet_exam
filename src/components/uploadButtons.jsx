import { useState } from 'react';

import UploadModal from '../components/modal/uploadModal'

import { ReactComponent as Arrow } from '../assets/icons/left_arrow.svg';

import classes from '../styles/components/uploadButtons.module.scss'


const UploadButtons = ({index , activeBtn ,activeBtnHandler ,nullingActiveBtnHandler}) => {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const uploadSuccess = `"عکس آپلود شد"`;

    const modalHandler = () =>{
        nullingActiveBtnHandler()
        setIsModalOpen(prev => !prev)
    }

    // const 

    return (

        // <li className={classes.uploadRow}>
        <li key={index} >
            {
                isModalOpen && 
                <UploadModal questionNo={index} onConfirm={modalHandler} />
            }
            <div className={classes.uploadContainer} >
                {/*when upload was successful `successUpload` class will active / and when user click on button active_uploadBtn will active */}
                <div className={`${classes.uploadBtn_container} ${ activeBtn === index && classes.active_uploadBtn}`} onClick={()=>{setIsModalOpen(true);activeBtnHandler(index)}}>
                    <p className={` ${classes.uploadBtn} uploadBtn-${1} `}>{`(کلیک کنید)`}</p>
                    <Arrow className={`${classes.arrow} ${ activeBtn === index && classes.active_arrow } `} /> {/* when user click on bitten `active_arrow` class will appear */}
                </div>
                <div className={classes.grade}>
                    <div>{`۰/۲۵`}</div>
                    <div>بارم</div>
                </div>
            </div>
        </li>
        // </li>
    )
}



export default UploadButtons;