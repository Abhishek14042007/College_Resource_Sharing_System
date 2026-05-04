import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Leaderboard/context/AuthContext';
import api from '../api';

const Auth = () => {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [mode, setMode] = useState('login');
    const [form, setForm] = useState({ name: '', email: '', password: '', college: '', department: '', year: '1st' });
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const payload = { email: form.email, password: form.password };
            const route = mode === 'login' ? '/auth/login' : '/auth/register';
            if (mode === 'register') {
                payload.name = form.name;
                payload.college = form.college;
                payload.department = form.department;
                payload.year = form.year;
            }
            const response = await api.post(route, payload);
            login(response.data);
            navigate('/');
        } catch (error) {
            setMessage(error?.response?.data?.message || 'Authentication failed');
        }
    };

    return (
        <div style={{ maxWidth: '560px', margin: '0 auto' }}>
            <h2>{mode === 'login' ? 'Login to your account' : 'Create a new account'}</h2>
            <p style={{ color: '#64748b' }}>{mode === 'login' ? 'Access shared college resources.' : 'Register to upload and save materials.'}</p>
            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '14px', marginTop: '20px' }}>
                {mode === 'register' && (
                    <input
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        placeholder="Name"
                        required
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                    />
                )}
                <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                    required
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
                <input
                    type="password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="Password"
                    required
                    minLength={6}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                />
                {mode === 'register' && (
                    <>
                        <input
                            value={form.college}
                            onChange={(e) => setForm({ ...form, college: e.target.value })}
                            placeholder="College"
                            required
                            style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                        />
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                            <input
                                value={form.department}
                                onChange={(e) => setForm({ ...form, department: e.target.value })}
                                placeholder="Department"
                                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            />
                            <select
                                value={form.year}
                                onChange={(e) => setForm({ ...form, year: e.target.value })}
                                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1' }}
                            >
                                <option value="1st">1st</option>
                                <option value="2nd">2nd</option>
                                <option value="3rd">3rd</option>
                                <option value="4th">4th</option>
                                <option value="Graduate">Graduate</option>
                                <option value="Faculty">Faculty</option>
                            </select>
                        </div>
                    </>
                )}
                <button type="submit" style={{ background: '#1e3a8a', color: '#fff', border: 'none', padding: '12px 18px', borderRadius: '10px', cursor: 'pointer' }}>
                    {mode === 'login' ? 'Login' : 'Register'}
                </button>
                {message && <p style={{ color: '#b91c1c' }}>{message}</p>}
            </form>
            <button
                type="button"
                onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
                style={{ marginTop: '18px', background: 'transparent', border: 'none', color: '#1e3a8a', cursor: 'pointer' }}
            >
                {mode === 'login' ? 'Create an account' : 'Already have an account? Login'}
            </button>
        </div>
    );
};

export default Auth;
