import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from '../Leaderboard/components/Navbar';
import { AuthProvider } from '../Leaderboard/context/AuthContext';
import Auth from './pages/Auth';
import Home from './pages/Home';
import Profile from './pages/Profile';
import ResourceDetail from './pages/ResourceDetail';
import Resources from './pages/Resources';
import Upload from './pages/Upload';

const App = () => {
    return (
        <AuthProvider>
            <div style={{ minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
                <Navbar />
                <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/resources" element={<Resources />} />
                        <Route path="/resources/:id" element={<ResourceDetail />} />
                        <Route path="/upload" element={<Upload />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/auth" element={<Auth />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </main>
            </div>
        </AuthProvider>
    );
};

export default App;
