import Home from './pages/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './pages/Form/FormNavBar'
import Result from './pages/auditResult/AuditResultNavBar'
import AuditDiff from './pages/auditResult/AuditDiff'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit" element={<Form />} />
        <Route path="/audit/:id" element={<Result />} />
        <Route path="/audit/:id/diff" element={<AuditDiff />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
