import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  // Save user to localStorage whenever user state changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const signInWithGoogle = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const userData = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
        given_name: decoded.given_name,
        family_name: decoded.family_name,
        signInMethod: 'google',
        signInTime: new Date().toISOString(),
      };

      setUser(userData);
      console.log('User signed in:', userData);
    } catch (error) {
      console.error('Error decoding Google credential:', error);
    }
  };

  const signInWithEmail = (email, password) => {
    // For demo purposes, create a mock user
    const userData = {
      id: `email_${Date.now()}`,
      name: email.split('@')[0],
      email: email,
      picture: null,
      signInMethod: 'email',
      signInTime: new Date().toISOString(),
    };

    setUser(userData);
    console.log('User signed in with email:', userData);
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('user');
    console.log('User signed out');
  };

  const isSignedIn = () => {
    return user !== null;
  };

  const value = {
    user,
    isLoading,
    signInWithGoogle,
    signInWithEmail,
    signOut,
    isSignedIn,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};