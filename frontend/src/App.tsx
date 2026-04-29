import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import UploadPage from "./pages/UploadPage";
import ProcessingPage from "./pages/ProcessingPage";
import MeetingPage from "./pages/MeetingsPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";

const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/meetings" replace />} />
        <Route path="/upload" element={<UploadPage/>} />
        <Route path="/processing" element={<ProcessingPage/>} />
        <Route path="/meetings" element={<MeetingPage/>} />
        <Route path ="meetings/:id" element ={<MeetingDetailPage/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;