import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSignedIn, setIsSignedIn] = useState(false);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsSignedIn(!!session?.user);
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setIsSignedIn(!!session?.user);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUpWithOTP = async (email, password, userData = {}) => {
    try {
      // First check if user already exists
      const { exists, emailConfirmed } = await checkUserExists(email);

      if (exists && emailConfirmed) {
        return {
          data: null,
          error: { message: "User already exists with this email. Please sign in instead." }
        };
      }

      if (exists && !emailConfirmed) {
        return {
          data: null,
          error: { message: "User already exists but email not verified. Please check your email for the verification link or contact support." }
        };
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            first_name: userData.firstName || '',
            last_name: userData.lastName || '',
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signUp = async (email, password, userData = {}) => {
    return await signUpWithOTP(email, password, userData);
  };

  const verifySignupOTP = async (email, token) => {
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'signup'
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const resendSignupOTP = async (email) => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
      setIsSignedIn(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };


  const checkUserExists = async (email) => {
    try {
      // Use the admin API to check if user exists
      const { data, error } = await supabase.rpc('check_user_exists', {
        user_email: email
      });

      if (error) {
        // Fallback method - try to sign in with invalid password
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: email,
          password: 'invalid_password_for_check'
        });

        if (signInError) {
          if (signInError.message.includes('Invalid login credentials') ||
              signInError.message.includes('Wrong password') ||
              signInError.message.includes('Email not confirmed')) {
            return { exists: true, emailConfirmed: signInError.message.includes('Email not confirmed') ? false : true };
          } else if (signInError.message.includes('not found') ||
                     signInError.message.includes('User not found')) {
            return { exists: false, emailConfirmed: false };
          }
        }
        return { exists: true, emailConfirmed: true };
      }

      return {
        exists: data?.user_exists || false,
        emailConfirmed: data?.email_confirmed || false
      };
    } catch (error) {
      return { exists: false, emailConfirmed: false };
    }
  };

  const sendPasswordResetOTP = async (email) => {
    try {
      // First check if user exists
      const { exists } = await checkUserExists(email);

      if (!exists) {
        return {
          error: {
            message: "No account found with this email address. Please sign up first."
          }
        };
      }

      // User exists, now send the reset email
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) {
        throw error;
      }

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const verifyOtpAndUpdatePassword = async (email, token, newPassword) => {
    try {
      // For password reset, use type: 'recovery'
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token,
        type: 'recovery'
      });

      if (verifyError) throw verifyError;

      // Now update the password using the authenticated session
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) throw updateError;

      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  const updateProfile = async (updates) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data: updates
      });
      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error };
    }
  };

  // Format user data to match Clerk's structure
  const formatUser = (user) => {
    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      fullName: user.user_metadata?.full_name || '',
      firstName: user.user_metadata?.first_name || '',
      lastName: user.user_metadata?.last_name || '',
      primaryEmailAddress: {
        emailAddress: user.email
      },
      user_metadata: user.user_metadata,
      created_at: user.created_at
    };
  };

  const value = {
    user: formatUser(user),
    isSignedIn,
    loading,
    isLoading: loading,
    signUp,
    signUpWithOTP,
    verifySignupOTP,
    resendSignupOTP,
    checkUserExists,
    signIn,
    signInWithEmail: signIn, // Alias for compatibility
    signOut,
    sendPasswordResetOTP,
    updatePassword,
    verifyOtpAndUpdatePassword,
    updateProfile,
    // Clerk compatibility methods
    isLoaded: !loading,
    userId: user?.id,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for Clerk compatibility
export const useUser = () => {
  const { user, isSignedIn, loading } = useAuth();
  return {
    user,
    isSignedIn,
    isLoaded: !loading,
  };
};

// Hook for Clerk compatibility
export const useClerk = () => {
  const { signOut } = useAuth();
  return {
    signOut,
  };
};