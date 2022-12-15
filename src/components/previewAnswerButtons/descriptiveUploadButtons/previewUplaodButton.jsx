import { ReactComponent as Arrow } from '../../../assets/icons/left_arrow.svg';

import classes from '../../../styles/components/uploadButtons.module.scss'

const PreviewUploadButtons = ({ index, score, activeBtn }) => {


    return (

        // <li className={classes.uploadRow}>
        <li key={index} className={classes.uploadButtonRow}>
            <div className={classes.uploadContainer} >
                {/*when upload was successful `successUpload` class will active / and when user click on button active_uploadBtn will active */}
                <div className={`${classes.uploadBtn_container} ${activeBtn === index && classes.active_uploadBtn}`}    >
                    <p className={` ${classes.uploadBtn} uploadBtn-${index} `}>{"کلیک کنید"}</p>
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



export default PreviewUploadButtons;