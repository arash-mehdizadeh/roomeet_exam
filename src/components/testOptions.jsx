
const TestOptions = ({option,data}) => {
    return (
        <li>
            <p className='muCh-options'>{`گزینه ${option} :`}</p>
            <p className='muCh-answer'>{data}</p>
        </li>
    )
}

export default TestOptions