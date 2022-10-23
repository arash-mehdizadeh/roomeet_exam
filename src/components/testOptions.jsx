import classes from '../styles/components/testOptions.module.scss';

const TestOptions = ({option,data}) => {
    return (
        <li className={classes.muChList}>
            <p className={classes.muChOptions}>{`گزینه ${option} :`}</p>
            <p className={classes.muChAnswer}>{data}</p>
        </li>
    )
}

export default TestOptions