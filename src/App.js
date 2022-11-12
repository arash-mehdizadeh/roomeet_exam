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
                <Route path="/quiz/join/:quiz_id" element={<ExamInfo/>} />
                <Route path="/test/:quiz_id" element={<TestExam/>} />
                <Route path="/quiz/test-pdf/:quiz_id" element={<TestPdfExam/>} />
                <Route path="/homework" element={<Homework/>} />
                <Route path="/quiz/descriptive/:quiz_id" element={<DescriptiveExam/>} />
                <Route path="/quiz/descriptive-pdf/:quiz_id" element={<DescriptivePdfExam/>} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App