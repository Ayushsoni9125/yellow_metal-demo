import { useState } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import HomePage from './pages/home/HomePage'
import ApplyPage from './pages/apply/ApplyPage'
import AdminPage from './pages/admin/AdminPage'
import PortalGate, { PORTAL_AUTH_KEY } from './components/auth/PortalGate'

export default function App() {
  const navigate = useNavigate()
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem(PORTAL_AUTH_KEY) === '1'
  )

  const handleUnlock = () => {
    sessionStorage.setItem('gc_admin_auth', '1')
    setIsUnlocked(true)
    navigate('/', { replace: true })
  }

  if (!isUnlocked) {
    return <PortalGate onUnlock={handleUnlock} />
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/apply" element={<ApplyPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}


