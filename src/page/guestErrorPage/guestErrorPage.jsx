import { ReactComponent as Close } from '../../assets/icons/close.svg'

import classes from '../../App.module.scss';
import { useEffect } from 'react';

const GuestErrorPage = () => {

    useEffect(() => {
        document.title = "ورود مهمان غیر فعال است";
    }, [])

    return (
        <div className={classes.appContainer}>
            <div className={classes.container} style={{alignItems:"center"}}>
                <section className={classes.questionSection} style={{width:"100%"}}>
                    <div className={classes.center}>
                        <Close />
                    </div>
                    <div className={classes.center}>
                        <h1 className={classes.title}>امکان ورود مهمان به این آزمون وجود ندارد</h1>
                    </div>
                    <div className={classes.center}>
                        <a href='https://panel.roomeet.ir/' target="_self" rel="noreferrer" className={classes.redirect__btn} >بازگشت به پنل</a>
                    </div>
                </section>
            </div>
        </div>
    )
}
const ServiceNotValid = () => {

    useEffect(() => {
        document.title = "سرویس غیرفعال است";
    }, [])

    return (
        <div className={classes.appContainer}>
            <div className={classes.container} style={{alignItems:"center"}}>
                <section className={classes.questionSection} style={{width:"100% !important"}}>
                    <div className={classes.center}>
                        <Close />
                    </div>
                    <div className={classes.center}>
                        <h1 className={classes.title}>سرویس آزمون آموزشگاه شما معتبر نیست. لطفا با مدیر آموزشگاه تماس بگیرید</h1>
                    </div>
                    <div className={classes.center}>
                        <a href='https://panel.roomeet.ir/' target="_self" rel="noreferrer" className={classes.redirect__btn} >بازگشت به پنل</a>
                    </div>
                </section>
            </div>
        </div>
    )
}

export { GuestErrorPage, ServiceNotValid }