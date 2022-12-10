import { ReactComponent as Done } from '../../assets/icons/done.svg'

import classes from '../../App.module.scss';
import { useEffect } from 'react';

const FinishPage = () => {

    useEffect(()=>{
        document.title = 'آزمون با موفقیت به پایان رسید';
    },[])

    return (
        <div className={classes.appContainer}>
            <div className={classes.container}>
                <section className={classes.questionSection}>
                    <div className={classes.center}>
                        <Done/>
                    </div>
                    <div className={classes.center}>
                        <h1 className={classes.title}>آزمون شما با موفقیت به اتمام رسید .</h1>
                    </div>
                    <div className={classes.center}>
                        <button className={classes.redirect__btn}>بازگشت به پنل</button>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default FinishPage