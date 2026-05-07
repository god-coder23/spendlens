import React from 'react'
import Home from './pages/Home/Home'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Form from './pages/Form/FormNavBar'
import Result from './pages/Result/Result'

const App = () => {
  return (
    <div>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/audit" element={<Form />} />
        <Route path="/result" element={<Result />} />
      </Routes>
    </BrowserRouter>
    </div>
  )
}

export default App
