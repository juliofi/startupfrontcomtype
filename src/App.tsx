import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Cadastro from './pages/Cadastro'
import './App.css'
import Batalhas from './pages/Batalhas'
import Administrar from './pages/Administrar'
import Resultado from './pages/Resultado'
import Premiacao from './pages/Premiacao'


function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/batalhas" element={<Batalhas />} />
        <Route path="/administrar" element={<Administrar />} />
        <Route path="/info" element={<Resultado />} />
        <Route path="/premiacao" element={<Premiacao />} />

        <Route path="/sorteio" element={<Navigate to="/batalhas" />} />
        <Route path="/resultado" element={<Navigate to="/info" />} />
      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
