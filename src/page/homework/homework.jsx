
import TestAnswerOptions from '../../components/testAnswerOptions';
import HomeworkQuestion from '../../components/homeworkQuetion';


import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from'../../App.module.scss';

function TestExam() {
    return (
        <div className={classes.appContainer}>
            <div className={classes.container}>
                <header className={classes.sidebarContainer}>
                    <div className={classes.headerBox}>
                        <div className={classes.buttonContainer}>
                            <p>اتمام آزمون</p>
                            <p  >ترک آزمون</p>
                        </div>
                        <svg id={classes.circle_container} viewBox="2 -2 28 36" xmlns="http://www.w3.org/2000/svg">
                            <linearGradient id={"gradient"}>
                                <stop id={classes.stop1} offset="0%" />
                                <stop id={classes.stop2} offset="100%" />
                            </linearGradient>
                            <circle id={classes.circle_container__background} r="16" cx="16" cy="16" shape-rendering="geometricPrecision"></circle>
                            <circle id={classes.circle_container__progress} r="16" cx="16" cy="16" shape-rendering="geometricPrecision">
                            </circle>
                        </svg>
                        {/* <div className='time-remained'>4:20:00</div> */}
                    </div>
                    <div className={classes.informationBar}>
                        <div className={classes.examDetails}>
                            <div className={classes.examDetailsTitle}>
                                <h1>{`آزمون ادبیات فارسی`}</h1>
                                <p>{`(آموزشگاه فراگویان)`}</p>
                            </div>
                            <div id={classes.returnBtn}>
                                <p>بازگشت به سایت</p>
                                <div className={classes.exitIcon}>
                                    <Exit fill='#fff' width="15px" height='15px' />
                                </div>
                            </div>
                        </div>
                        <div className={classes.personalDetails}>
                            <ul>
                                <li>{`نام کاربر : ${"فردوسی"}`}</li>
                                <li>{`مدت آزمون : ${60} دقیقه`}</li>
                                <li>{`نوع آزمون : ${"تستی"}`}</li>
                                <li>{`ضریب منفی : ${"3 به 1"}`}</li>
                                <li>{`تعداد سوالات : ${100}`}</li>
                            </ul>
                        </div>
                    </div>
                </header>

                <main className={classes.mainContainer}>
                    <div className={classes.answerSheetContainer}>
                        <div className={classes.answerSheetHeader}>
                            <h3>پاسخنامه</h3>
                            <div className={classes.answerDatasheet}>
                                <p className={classes.answerDatasheet_answer}>{`پاسخ داده شده : ${85}`}</p>
                                <p className={classes.answerDatasheet_notAnswer}>{`پاسخ داده نشده : ${0}`}</p>
                            </div>
                        </div>
                        <div className={classes.textareaContainer}>
                            <textarea className={classes.textarea} placeholder='اینجا بنویسید' />
                            <div className={classes.uploadSection}>
                                <div id={classes.uploadbtn}>آپلود عکس جواب</div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                    {/* DISPLAY QUESTION / QUESTION SECTION  */}
                    <section className={classes.questionSection}>
                        <div className={classes.questionSection_header}>
                            <h2>سوالات آزمون</h2>
                            <div id={classes.reloadBtn}>
                                <p>بارگذاری مجدد</p>
                                <div className={classes.refreshBtn}>
                                    <Refresh />
                                </div>
                            </div>
                        </div>
                        <div className={classes.questionContainer}>
                            <HomeworkQuestion />
                        </div>
                    </section>
                </main>

            </div>
        </div>
    );
}

export default TestExam;
