import { createContext, useEffect, useMemo, useState } from 'react';
import api from '../../src/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('crssUser');
        return stored ? JSON.parse(stored) : null;
    });

    useEffect(() => {
        if (user?.token) {
            api.defaults.headers.common.Authorization = `Bearer ${user.token}`;
            localStorage.setItem('crssUser', JSON.stringify(user));
        } else {
            delete api.defaults.headers.common.Authorization;
            localStorage.removeItem('crssUser');
        }
    }, [user]);

    const login = (data) => setUser(data);
    const logout = () => setUser(null);

    const value = useMemo(() => ({ user, login, logout }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
