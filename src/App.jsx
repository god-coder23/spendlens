import Home from './pages/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './pages/Form/FormNavBar'
import Result from './pages/auditResult/AuditResultNavBar'
const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit" element={<Form />} />
        <Route path="/audit/:audit" element={<Result />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
