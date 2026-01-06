'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error: any }>;
  loginWithOtp: (email: string) => Promise<{ error: any }>;
  verifyOtp: (email: string, token: string, type: 'email' | 'recovery') => Promise<{ error: any; data: { session: Session | null; user: User | null } }>;
  logout: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: any }>;
  updateUserPassword: (password: string) => Promise<{ error: any }>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    // Try sign in
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // If sign in fails, maybe we should try sign up? 
    // For now, let's keep it strict "Login". Use separate register flow if needed.
    // However, typical "Login/Signup" flows might auto-register on OTP, but not password.

    return { error };
  };

  const loginWithOtp = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        // If you want to use the otp as a magic link, strictly speaking signInWithOtp sends a link by default unless shouldCreateUser is false?
        // Actually, Supabase sends a Magic Link by default. To send a numeric OTP, you need to configure Supabase templates.
        // But for client code, it's the same call.
        shouldCreateUser: true,
      },
    });
    return { error };
  };

  const verifyOtp = async (email: string, token: string, type: 'email' | 'recovery') => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type,
    });
    return { data, error };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const resetPasswordForEmail = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      // redirectTo: 'http://localhost:3000/reset-password', // Not needed if doing in-modal flow usually, but Supabase requires a link flow.
      // Wait, standard Supabase 'resetPasswordForEmail' sends a LINK.
      // If we want an OTP for reset, we use signInWithOtp (which works for existing users too).
      // But standard reset flow is: Send Link -> Click Link -> Update Password.
      // If the user wants "Enter OTP" for reset, we should use verifyOtp with type 'recovery' if we sent an OTP.
      // NOTE: verifyOtp with 'recovery' works if we use signInWithOtp? No, signInWithOtp is for login.
      // Typically 'resetPasswordForEmail' sends a magic link.
      // To get an OTP for password reset, currently Supabase supports 'magiclink' or 'signup' otps.
      // Getting a specific "Password Reset OTP" is less common in standard Supabase unless configured.
      // However, we can use `signInWithOtp` (magic code) to log them in, 
      // AND THEN they can update their password. That is effectively a reset flow.
      // Steps: 
      // 1. signInWithOtp(email) -> sends code
      // 2. verifyOtp(email, code, type='email') -> logs user in
      // 3. updateUser({ password: newPassword }) -> updates password
      // This is a secure "Forgot Password" flow via OTP.
      redirectTo: undefined,
    });
    return { error };
  };

  const updateUserPassword = async (password: string) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{
      user,
      session,
      login,
      loginWithOtp,
      verifyOtp,
      logout,
      resetPasswordForEmail,
      updateUserPassword,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};