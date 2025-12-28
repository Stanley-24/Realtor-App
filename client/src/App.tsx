import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from '@/pages/Home'
import LoginPage from '@/pages/Auth/loginPage'
import SignupPage from '@/pages/Auth/signupPage'
import AgentDashboard from '@/pages/Dashboard/agent'
import AdminDashboard from '@/pages/Dashboard/admin'
import BuyerDashboard from '@/pages/Dashboard/buyer'
import ProtectedRoute from '@/sharedComponents/ProtectedRoute'
import { useAuthStore } from '@/store/authStore'
import SelectRolePage from '@/pages/Auth/SelectRolePage'
import ResetPasswordPage from '@/pages/Auth/resetPass'
import ForgotPasswordPage from '@/pages/Auth/forgetPass'
import CreatePropertyPage from './pages/Dashboard/agent/components/createProperty'
import { Toaster } from 'sonner';


function App() {
  const { checkAuth } = useAuthStore();

  // Check authentication status on app mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Routes>
        <Route path='/' element={< HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path="/select-role" element={<SelectRolePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />


        <Route element={<ProtectedRoute allowedRoles={["admin"]}/> }>
          <Route path='/dashboard/admin' element={<AdminDashboard />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["agent"]} />}>
          <Route path="/dashboard/agent" element={<AgentDashboard />}>
            <Route index element={<CreatePropertyPage />} /> 
            {/* or AgentHome later */}

            <Route
              path="create-property"
              element={<CreatePropertyPage />}
            />

            <Route
              path="my-listings"
              element={<div>My Listings</div>}
            />

            <Route
              path="analytics"
              element={<div>Analytics</div>}
            />

            <Route
              path="inbox"
              element={<div>Inbox</div>}
            />

            <Route
              path="update-listing"
              element={<div>Update Listing</div>}
            />

            <Route
              path="recently-deleted"
              element={<div>Recently Deleted</div>}
            />
          </Route>
        </Route>


        <Route element={<ProtectedRoute allowedRoles={["buyer"]}/> }>
          <Route path='/dashboard/buyer' element={<BuyerDashboard />} />
        </Route>

      </Routes>

      <Toaster 
        position="top-center"   // or top-right, bottom-center, etc.
        richColors              // nice colored toasts (success green, error red)         
        duration={3000}  // auto-dismiss after 3
        toastOptions={{
          style: {
            background: "#028100",
            color: 'white',
            fontSize: '16px',
            fontFamily: "Arial, sans-serif",
          },
        }}
      />
    </>
  )
}

export default App
