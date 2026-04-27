import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API from '../utils/axiosConfig'
// 1. Import the context object from our hooks file
import { AuthContext } from '../hooks/useAuth';

// 2. This file now only exports the Provider component
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // Add loading state

    useEffect(() => {
        if (authToken) {
            API.defaults.headers.common['Authorization'] = `Token ${authToken}`;
            localStorage.setItem('authToken', authToken);

            API.get('/api/auth/user/')
                .then(response => {
                    setUser(response.data);
                    setIsLoading(false);
                })
                .catch(() => {
                    // If token is invalid, log out
                    logout(); 
                    setIsLoading(false);
                });
        } else {
            delete API.defaults.headers.common['Authorization'];
            localStorage.removeItem('authToken');
            setUser(null);
            setIsLoading(false); // No token, so we're done loading
        }
    }, [authToken]);

    const login = (token) => {
        setAuthToken(token);
    };

    const logout = () => {
        setAuthToken(null);
    };

    // Pass the isLoading state down so components can use it
    const value = { authToken, user, isLoading, login, logout };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};