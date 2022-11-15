
import classes from '../styles/components/TestAnswerOptions.module.scss'

const TestAnswerOptions = ({ id, options, score }) => {
    // console.log(options);
    return (
        <li key={id} >
            <div className={classes.testRow}>
                <div className={classes.testOptionsContainer}>
                    {
                        options?.map((el) => (
                            <div key={el.id} className={classes.testOptionButton}>{el.option_number}</div>
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