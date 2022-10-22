import { useState } from 'react';

// import HomeworkQuestion from '../../components/homeworkQuetion';


import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Delete } from '../../assets/icons/Delete.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';

import classes from'../../App.module.scss';
import UploadButtons from '../../components/uploadButtons';

function DescriptiveExam() {
    
    const [activeBtn, setActiveBtn] = useState(null);
    const arr = [1,2,3,4,5,6,7,8,9,0,10];

    const activeBtnHandler = (index) =>{
        setActiveBtn(index);
        console.log(index);
    }
    const nullingActiveBtnHandler = () =>{
        setActiveBtn(null);
    }

    return (
        <div className={classes.appContainer}>
            <div className={classes.container}>
                <header className={classes.examTimeRemainedContainer}>
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
                        <div className={classes.uploadAnswersSheet}>
                            <ul>
                                {
                                    arr.map((data)=>(
                                        <UploadButtons 
                                        index={data} 
                                        activeBtn={activeBtn} activeBtnHandler={activeBtnHandler} 
                                        nullingActiveBtnHandler={nullingActiveBtnHandler}
                                        />
                                    ))
                                }
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                                <UploadButtons />
                            </ul>
                        </div>
                    </div>
                    {/* DISPLAY QUESTION / QUESTION SECTION  */}
                    <section className={classes.questionSection}>
                        <div className={classes.questionSection_header}>
                            <h2>سوالات آزمون</h2>
                            <div className={classes.reloadBtn}>
                                <p>بارگذاری مجدد</p>
                                <div id={classes.refreshIcon}>
                                    <Refresh />
                                </div>
                            </div>
                        </div>
                        <div className={classes.questionContainer}>
                            pdf
                        </div>
                    </section>
                </main>

            </div>
        </div>
    );
}

export default DescriptiveExam;
