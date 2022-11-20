import { useState ,useEffect } from 'react';
import { postUserTestAnswer } from '../assets/api/userActions';

import classes from '../styles/components/TestAnswerOptions.module.scss'

const TestAnswerOptions = ({ id,attemptID , options, score }) => {
    // console.log(options);
    
    const [activeBtn, setActiveBtn] = useState(0)

    const postAnswerDataHandler = ( optionNum ) =>{
        // e.preventDefault();
        // console.log("id =>" +id,"attempID =>" +attemptID , "ActiveBtn => " + optionNum );
        postUserTestAnswer(id,attemptID,optionNum).then(res => console.log(res))
    }
    
    const onOptionClickHandler = (num) => {
        setActiveBtn(num);
        postAnswerDataHandler(num)
    }
    
    return (
        <li key={id} >
            <div className={classes.testRow}>
                <div className={classes.testOptionsContainer}>
                    {
                        options?.map((el) => (
                            <div key={el.id} onClick={ () => onOptionClickHandler(el.option_number) }
                            className={`${classes.testOptionButton} ${activeBtn === el.option_number ? classes.active_btn : ""} `}>{el.option_number}</div>
                        ))
                    }
                    {/* <div className={classes.testOptionButton}>۲</div>
                    <div className={classes.testOptionButton}>۳</div>
                    <div className={classes.testOptionButton}>٤</div> */}
                </div>
                <div className={classes.grade}>
                    <div>{score}</div>
                    <div >بارم</div>
                </div>
            </div>
        </li>
    )
}

export default TestAnswerOptions;