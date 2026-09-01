import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import ApplyPage from './pages/apply/ApplyPage'
import AdminPage from './pages/admin/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

