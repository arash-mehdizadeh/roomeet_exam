import { BrowserRouter, Route, Routes } from "react-router-dom"
import TestExam from "./page/testExam/testExam"
import TestPdfExam from "./page/testPdfExam/testPdfExam"
import Homework from "./page/homework/homework"
import DescriptiveExam from "./page/descriptiveExam/descriptiveExam"
import DescriptivePdfExam from "./page/descriptive_pdf_exam/descriptrivePdf"
import ExamInfo from "./page/exam_info/examInfo"
import NotFound from "./page/notFound/notFound"
import FinishPage from "./page/finishPage/finishPage"
import TestPreviewExam from "./page/preview/test/testPreview"
import TestPdfPreview from "./page/preview/testPdf/testPdfPreview"
import DescriptivePreview from "./page/preview/descriptive/descriptivePreview"
import DescriptivePdfPreview from "./page/preview/descriptivePdf/descriptivePdfPreview"
import GuestLogin from "./page/guestLogin/guestLogin"



const App = () => {

    return (
        <BrowserRouter>
            <Routes>
                {/* <Route path="/" element={<></>} /> */}
                <Route path="/quiz/finish" element={<FinishPage/>} />
                <Route path="/quiz/join/:quiz" element={<ExamInfo/>} />
                <Route path="/guest/join/:quiz" element={<GuestLogin/>} />
                <Route path="/quiz/test/:quiz" element={<TestExam/>} />
                <Route path="/quiz/test-pdf/:quiz" element={<TestPdfExam/>} />
                <Route path="/quiz/descriptive/:quiz" element={<DescriptiveExam/>} />
                <Route path="/quiz/descriptive-pdf/:quiz" element={<DescriptivePdfExam/>} />
                <Route path="/preview/test/:quiz" element={<TestPreviewExam/>} />
                <Route path="/preview/test-pdf/:quiz" element={<TestPdfPreview/>} />
                <Route path="/preview/descriptive/:quiz" element={<DescriptivePreview/>} />
                <Route path="/preview/descriptive-pdf/:quiz" element={<DescriptivePdfPreview/>} />
                <Route path="/homework" element={<Homework/>} />
                <Route path="*" element={<NotFound/>} />
            </Routes>
        </BrowserRouter>
        
    )
}

export default App