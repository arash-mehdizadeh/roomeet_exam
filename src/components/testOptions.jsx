import classes from '../styles/components/testOptions.module.scss';

const TestOptions = ({id ,optionNo ,optionBody}) => {
    return (
        <li className={classes.muChList} key={id}>
            <p className={classes.muChOptions}>{`گزینه ${optionNo} :`}</p>
            <p className={classes.muChAnswer}>{optionBody}</p>
        </li>
    )
}

export default TestOptions