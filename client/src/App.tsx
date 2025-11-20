import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/Home'
import LoginPage from './pages/Auth/loginPage'
import SignupPage from './pages/Auth/signupPage'
import AgentDashboard from './pages/Dashboard/agent'
import AdminDashboard from './pages/Dashboard/admin'
import BuyerDashboard from './pages/Dashboard/buyer'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'

function App() {
  const { checkAuth } = useAuthStore();

  // Check authentication status on app mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Routes>
      <Route path='/' element={< HomePage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/signup' element={<SignupPage />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]}/> }>
        <Route path='/dashboard/admin' element={<AdminDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["agent"]}/> }>
        <Route path='/dashboard/agent' element={<AgentDashboard />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["buyer"]}/> }>
        <Route path='/dashboard/buyer' element={<BuyerDashboard />} />
      </Route>
    </Routes>
  )
}

export default App
