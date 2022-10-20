import { BrowserRouter, Route, Routes } from "react-router-dom"
import TestExam from "./page/testExam/testExam"
import TestPdfExam from "./page/testPdfExam/testPdfExam"

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<TestExam/>} />
                <Route path="testexam" element={<TestPdfExam/>} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App