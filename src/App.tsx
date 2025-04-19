import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import './App.css'


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
