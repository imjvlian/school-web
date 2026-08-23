import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
export default function ProtectedRoute({children}) { const {user,isAdmin,loading}=useAuth(); const location=useLocation(); if(loading)return <div className="admin-loading">Memeriksa sesi admin...</div>; if(!user||!isAdmin)return <Navigate to="/login" state={{from:location.pathname}} replace/>; return children }
