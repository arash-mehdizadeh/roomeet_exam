import { BrowserRouter, Route, Routes } from "react-router-dom"
import TestExam from "./page/testExam/testExam"
import TestPdfExam from "./page/testPdfExam/testPdfExam"
import Homework from "./page/homework/homework"
import DescriptiveExam from "./page/descriptiveExam/descriptiveExam"
import DescriptivePdfExam from "./page/descriptive_pdf_exam/descriptrivePdf"
import ExamInfo from "./page/exam_info/examInfo"



const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<></>} /> */}
                <Route path="/quiz/join/:quiz_id" element={<ExamInfo/>} />
                <Route path="/quiz/test/:quiz" element={<TestExam/>} />
                <Route path="/quiz/test-pdf/:quiz" element={<TestPdfExam/>} />
                <Route path="/homework" element={<Homework/>} />
                <Route path="/quiz/descriptive/:quiz" element={<DescriptiveExam/>} />
                <Route path="/quiz/descriptive-pdf/:quiz" element={<DescriptivePdfExam/>} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App