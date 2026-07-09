import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import { ClienteDetalhe } from './pages/ClienteDetalhe'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/cliente/:clienteNome" element={<ClienteDetalhe />} />
      </Routes>
    </BrowserRouter>
  )
}
