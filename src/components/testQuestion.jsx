import TestOptions from "./testOptions"




const TestQuestion = () => {

    const optionsData = [{ id: 1, data: "باور کن نمیدونم`" }, { id: 2, data: "از من بپرس" }, { id: 3, data: "از این مبحث سوال نمیاد`" }, { id: 4, data: "یک یک موارد بالا" }]

    return (
        <div className="question-box">
            <div className='question-detail'>
                <p>{`سوال ${1} :`}</p>
                <p>{`( نمره${"۰/۲۵"})`}</p>
            </div>
            <div className='scrollable-questions-container'>
                <p>با توجه به عکس کدام گزینه درست است؟</p>
                <div className='muCh-image-container'>
                    {/* <img src/> */}
                    <p>image</p>
                </div>
                <div className='muCh-audio-container'>
                    voice
                </div>
                <div className='muCh-question-container'>
                    <ul>
                        {
                            optionsData.map(data => (
                                <TestOptions data={data.data} option={data.id} />
                            ))
                        }
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TestQuestion