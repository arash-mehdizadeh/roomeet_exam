import { useState, useEffect } from 'react';
import { ReactComponent as Cancel } from '../../../assets/icons/cancel.svg';

import classes from './TestAnswerOptions.module.scss'

const TestCheckboxPreviewButtons = ({ id, options, score }) => {

    const [activeBtn, setActiveBtn] = useState(0)


    return (
        <li key={id} >
            <div className={classes.testRow}>
                <div className={classes.testOptionsContainer}>

                    {
                        options?.map((el) => {
                            // console.log(el);
                            return <div key={el.id}
                                className={`${classes.testOptionButton}  ${activeBtn === el.option_number ? classes.active_btn : ""}`}>
                                {el.option_number}
                            </div>
                        })
                    }
                </div>
                <div className={classes.cancelContainer}>
                    <Cancel style={{ cursor: "pointer" }}/>
                </div>
                <div className={classes.grade}>
                    <div>{score}</div>
                    <div >بارم</div>
                </div>
            </div>
        </li>
    )
}

export default TestCheckboxPreviewButtons;