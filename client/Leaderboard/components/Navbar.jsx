import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <nav style={{ background: '#1e3a8a', color: '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '700', fontSize: '20px' }}>
                    College Resources
                </Link>
            </div>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
                <Link to="/resources" style={{ color: '#fff', textDecoration: 'none' }}>Browse</Link>
                <Link to="/upload" style={{ color: '#fff', textDecoration: 'none' }}>Upload</Link>
                {user ? (
                    <>
                        <Link to="/profile" style={{ color: '#fff', textDecoration: 'none' }}>Profile</Link>
                        <button
                            onClick={() => {
                                logout();
                                navigate('/auth');
                            }}
                            style={{ background: '#fff', color: '#1e3a8a', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer' }}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/auth" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600' }}>Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
