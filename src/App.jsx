import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'
import HomePage from './pages/HomePage'
import NewsPage from './pages/NewsPage'
import NewsDetailPage from './pages/NewsDetailPage'
import GalleryPage from './pages/GalleryPage'
import ProfilePage from './pages/ProfilePage'
import LoginPage from './pages/LoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AdminArticlesPage from './pages/admin/AdminArticlesPage'
import AdminPhotosPage from './pages/admin/AdminPhotosPage'
import AdminVideosPage from './pages/admin/AdminVideosPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/berita" element={<NewsPage />} />
        <Route path="/detail/:slug" element={<NewsDetailPage />} />
        <Route path="/foto" element={<GalleryPage />} />
        <Route path="/profil" element={<ProfilePage />} />
        <Route path="/login" element={<LoginPage />} />
      </Route>
      <Route path="/dashboard" element={<Navigate to="/admin" replace />} />
      <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<AdminDashboardPage />} />
        <Route path="artikel" element={<AdminArticlesPage />} />
        <Route path="foto" element={<AdminPhotosPage />} />
        <Route path="video" element={<AdminVideosPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
