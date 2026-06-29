import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { loginUser } from '../api/authService';
import api from '../api/axiosConfig';

export function AuthProvider({ children }) 
{
  const [user, setUser] = useState(null);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();


  // --- LOGOUT FUNCTION ---
  const logout = useCallback(() => {
    setUser(null);
    setOrder(null); // Clear orders on logout too
    localStorage.removeItem('authToken');
    delete api.defaults.headers.common['Authorization'];
    setLoading(false);
    navigate('/login');
  }, [navigate]);



  // --- FETCH USER DETAILS ---
  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/user/');
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user. Token might be invalid.", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, [logout]);



 // --- FETCH USER ORDERS ---
const fetchOrder = useCallback(async () => {
  try {
    const response = await api.get('/api/orders/');
    const data = response.data.results || response.data;
    setOrder(data); // This updates the global context state!
    return data;
  } catch (error) {
    console.error("Failed to fetch Orders.", error);
    return null;
  }
}, []);



  // --- INITIAL AUTH CHECK ---
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      api.defaults.headers.common['Authorization'] = `Token ${token}`;
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [fetchUser]);



  // --- FETCH ORDERS WHEN USER IS AUTHENTICATED ---
  useEffect(() => {
    if (user) {
      fetchOrder();
    }
  }, [user, fetchOrder]); // Adding dependency array stops the infinite loop



  // --- LOGIN FUNCTION ---
  const login = useCallback(async (credentials) => {
    try {
      const response = await loginUser(credentials);
      const { key } = response.data;

      localStorage.setItem('authToken', key);
      api.defaults.headers.common['Authorization'] = `Token ${key}`;
      
      await fetchUser();
      navigate('/');
    } catch (error) {
      console.error("Login failed", error);
      throw error; 
    }
  }, [fetchUser, navigate]);




  // --- PROVIDER VALUE MEMO ---
  const value = useMemo(() => {
    const processedUser = user ? { 
          ...user, 
          firstName: user.firstName || user.first_name || user.username || 'User', 
          lastName: user.lastName || user.last_name || '' 
        } : null;

    return {
      user: processedUser,
      order,
      fetchOrder,
      login,
      logout,
      isAuthenticated: !!user,
      loading
    };
  }, [user, order, fetchOrder, login, logout]); // Added order to tracking triggers
  
  

  // --- GUARD CLAUSE ---
  // Moved beneath all standard hooks to follow React rules rules
  if (loading) {
    return null; // Or insert a global loading spinner here
  }


  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}