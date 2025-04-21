import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import './App.css'
import Sorteio from './pages/Sorteio'
import Administrar from './pages/Administrar'
import Resultado from './pages/Resultado'


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/sorteio" element={<Sorteio />} />
        <Route path="/administrar" element={<Administrar />} />
        <Route path="/resultado" element={<Resultado />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
