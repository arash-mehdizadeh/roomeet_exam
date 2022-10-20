
import classes from '../styles/components/TestAnswerOptions.module.scss'

const TestAnswerOptions = () => {
    return (
        <li >
            <div className={classes.testRow}>
                <div className={classes.testOptionsContainer}>
                    <div className={classes.testOptionButton}>۱</div>
                    <div className={classes.testOptionButton}>۲</div>
                    <div className={classes.testOptionButton}>۳</div>
                    <div className={classes.testOptionButton}>٤</div>
                </div>
                <div className={classes.grade}>
                    <div>۰/۲۵</div>
                    <div>بارم</div>
                </div>
            </div>
        </li>
    )
}

export default TestAnswerOptions;