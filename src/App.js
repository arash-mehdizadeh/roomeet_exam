import { BrowserRouter, Route, Routes } from "react-router-dom"
import TestExam from "./page/testExam/testExam"
import TestPdfExam from "./page/testPdfExam/testPdfExam"
import Homework from "./page/homework/homework"
import DescriptiveExam from "./page/descriptiveExam/descriptiveExam"


const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TestExam/>} />
                <Route path="test-exam" element={<TestPdfExam/>} />
                <Route path="homework" element={<Homework/>} />
                <Route path="descriptive-exam" element={<DescriptiveExam/>} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App