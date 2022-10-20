

import TestAnswerOptions from '../../components/testAnswerOptions';

import { ReactComponent as Exit } from '../../assets/icons/exit.svg';
import { ReactComponent as Refresh } from '../../assets/icons/RightSquare.svg';



import '../../App.module.scss';

function TestPdfExam() {

    return (
        <div className="app-container">
            <div className='container'>
                <header className='sidebar-container'>
                    <div className='header-box'>
                        <div className='button-container'>
                            <p>اتمام آزمون</p>
                            <p  >ترک آزمون</p>
                        </div>
                        <svg class="circle-container" viewBox="2 -2 28 36" xmlns="http://www.w3.org/2000/svg">
                            <linearGradient id="gradient">
                                <stop class="stop1" offset="0%" />
                                <stop class="stop2" offset="100%" />
                            </linearGradient>
                            <circle class="circle-container__background" r="16" cx="16" cy="16" shape-rendering="geometricPrecision"></circle>
                            <circle class="circle-container__progress" r="16" cx="16" cy="16" shape-rendering="geometricPrecision">
                            </circle>
                        </svg>
                        {/* <div className='time-remained'>4:20:00</div> */}
                    </div>
                    <div className='information-bar'>
                        <div className='exam-details'>
                            <div className='exam-details-title'>
                                <h1>{`آزمون ادبیات فارسی`}</h1>
                                <p>{`(آموزشگاه فراگویان)`}</p>
                            </div>
                            <div id='return-btn'>
                                <p>بازگشت به سایت</p>
                                <div className='exit-icon'>
                                    <Exit fill='#fff' width="15px" height='15px' />
                                </div>
                            </div>
                        </div>
                        <div className='personal-details'>
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

                <main className='main-container'>
                    <div className='answer-sheet-container'>
                        <div className='answer-sheet-header'>
                            <h3>پاسخنامه</h3>
                            <div className='answer-datasheet'>
                                <p className='answer-datasheet-answer'>{`پاسخ داده شده : ${85}`}</p>
                                <p className='answer-datasheet-notAnswer'>{`پاسخ داده نشده : ${0}`}</p>
                                <div></div>
                            </div>
                        </div>
                        <div className='answer-sheet'>
                            <ul>
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                                <TestAnswerOptions />
                            </ul>
                        </div>
                    </div>
                    {/* DISPLAY QUESTION / QUESTION SECTION  */}
                    <section className='question-section'>
                        <div className='question-section-header'>
                            <h2>سوالات آزمون</h2>
                            <div id='reload-btn'>
                                <p>بارگذاری مجدد</p>
                                <div className='refresh-btn'>
                                    <Refresh />
                                </div>
                            </div>
                        </div>
                        <div className='question-container'>
                            
                        </div>
                    </section>
                </main>

            </div>
        </div>
    );
}

export default TestPdfExam;
