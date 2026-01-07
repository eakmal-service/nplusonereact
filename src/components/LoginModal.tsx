import React, { useState } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, signup, loginWithOtp, verifyOtp, updateUserPassword } = useAuth(); // Removed 'resetPasswordForEmail' as we use OTP flow for reset

  // Views: 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset' | 'signup'
  const [view, setView] = useState<'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset' | 'signup'>('login');

  // Login State
  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState(''); // New state for phone in signup
  const [rememberMe, setRememberMe] = useState(false);

  // Forgot Password State
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // UI Loading/Error State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to track if we are doing password reset or just login
  const [intent, setIntent] = useState<'login' | 'reset'>('login');

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const resetState = () => {
    setView('login');
    setLoginMethod('password');
    setEmail('');
    setPassword('');
    setPhone('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError(null);
    setLoading(false);
  };

  const handleClose = () => {
    onClose();
    resetState();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (loginMethod === 'password') {
        const { error } = await login(email, password);
        if (error) throw error;
        // Success
        handleClose();
      } else {
        // OTP Login request
        const { error } = await loginWithOtp(email);
        if (error) throw error;
        // Move to validtion view - maybe we need a 'login-otp-verify' view?
        // For simplicity, let's reuse 'forgot-otp' view but knowing context?
        // Or simpler: switch to a new view 'login-verify'
        // But the user requested "Sign in via OTP".
        // Let's add 'verify-otp' view designated for login verification.
        setView('forgot-otp'); // Wait, reusing this might be confusing if text says "Forgot Password". 
        // Let's rely on 'view' state context.
        // Actually, if I reuse 'forgot-otp', verifyOtp might need to know type.
        // For login, type is 'email' (magic link/code) or 'sms'.
        // For Supabase, signInWithOtp uses type 'email' for verification usually.
        // Let's use a generic 'verify-otp' view or just handle it.
        // I'll stick to reusing `forgot-otp` view structure but update text based on context?
        // Better: Change view to `verify-otp` and add a `type` state?
        // For now, I'll hack it: if view is 'forgot-otp' but previous was Login(OTP), handle accordingly?
        // Actually, let's separate `verify-otp` handling in render, but for now I'll map it to `forgot-otp` 
        // AND add a state `otpType` to know if it's for login or password reset?
        // Simpler: Just use `loginWithOtp` which logs you in. 
        // Once verified, you are logged in.
        // If it was "Forgot Password", we THEN verify so we are logged in, THEN we show "Reset Password" form.
        // So the flow is identical up to verification!
        // 1. Send OTP -> 2. Verify OTP -> (Logged In) -> 3. If it was "Forgot", show Reset Form. If "Login", Close.
        // I need a state to know "intent".
        // Let's assume intent is implicit by previous view/method? 
        // If I came from 'login' (OTP method), I just close after verify.
        // If I came from 'forgot-email', I move to 'forgot-reset' after verify.
        // I will add `intent` state.
        setIntent('login');
        setView('forgot-otp');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 1. Attempt Sign Up
      const { data, error } = await signup(email, password, {
        data: {
          phone: phone
        }
      });

      if (error) {
        // Check for specific "User already registered" error
        if (error.message.includes('already registered') || error.message.includes('unique constraint') || error.status === 400 || error.status === 422) { // Supabase often returns 400/422 for existing user
          // Refine error check if needed, but usually message is key.
          if (error.message.toLowerCase().includes('already registered') || error.message.toLowerCase().includes('user already exists')) {
            throw new Error("This email is already registered on NPlusOne Fashion");
          }
        }
        throw error;
      }

      // Success - user might be auto-logged in or need email confirmation.
      // If auto-confirmed is off, check data.user.confirmation_sent_at
      if (data?.user) {
        if (data.user.identities && data.user.identities.length === 0) {
          // This case happens if email is taken but not confirmed? 
          throw new Error("This email is already registered on NPlusOne Fashion");
        }
        alert("Account created successfully!");
        handleClose();
      }

    } catch (err: any) {
      setError(err.message || 'Sign up failed');
    } finally {
      setLoading(false);
    }
  };



  const handleForgotEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Use loginWithOtp for password reset flow too (it logs them in so they can change password)
      const { error } = await loginWithOtp(email);
      if (error) throw error;

      setIntent('reset');
      setView('forgot-otp');
    } catch (err: any) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      // Verify OTP. type 'email' is standard for signInWithOtp
      const { data, error } = await verifyOtp(email, otp, 'email');
      if (error) throw error;

      if (!data.session) {
        throw new Error("Invalid OTP or session not created");
      }

      // If intent was reset, go to reset password view
      if (intent === 'reset') {
        setView('forgot-reset');
      } else {
        // Intent was login (if we support OTP login verification here)
        // If the user used "Sign in via OTP" -> they are now logged in.
        handleClose();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP');
    } finally {
      setLoading(false);
    }
  };

  // Handle "Sign in via OTP" specifically if we want to flow it through the same verify screen
  // Currently `handleLoginSubmit` handles both.
  // We need to route `handleLoginSubmit` (OTP mode) to the same specific OTP entry view.
  // I will update `handleLoginSubmit` above to setIntent('login') and setView('forgot-otp').
  // NOTE: I need to update render of 'forgot-otp' to show generic "Enter OTP" title, not "Verify OTP" specifically for forgot password? 
  // Actually "Verify OTP" is generic enough.

  const handleForgotResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const { error } = await updateUserPassword(newPassword);
      if (error) throw error;

      alert("Password updated successfully!");
      handleClose();
    } catch (err: any) {
      setError(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const toggleMethod = () => {
    setLoginMethod(prev => prev === 'password' ? 'otp' : 'password');
    setPassword('');
    setError(null);
  };

  // Render content based on current view
  const renderContent = () => {
    switch (view) {
      case 'forgot-email':
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-1 text-white -mt-6">FORGOT PASSWORD</h2>
            <p className="text-center text-gray-300 text-sm mb-8">Enter your email to receive an OTP</p>
            {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
            <form onSubmit={handleForgotEmailSubmit}>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 uppercase font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-70"
              >
                {loading ? 'Sending...' : 'NEXT'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-white text-sm hover:underline"
              >
                Back to Login
              </button>
            </div>
          </>
        );

      case 'forgot-otp':
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-1 text-white -mt-6">VERIFY OTP</h2>
            <p className="text-center text-gray-300 text-sm mb-8">Enter the OTP sent to {email}</p>
            {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
            <form onSubmit={handleForgotOtpSubmit}>
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 uppercase font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-70"
              >
                {loading ? 'Verifying...' : 'VERIFY'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setView(intent === 'login' ? 'login' : 'forgot-email')}
                className="text-white text-sm hover:underline"
              >
                Back
              </button>
            </div>
          </>
        );

      case 'forgot-reset':
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-1 text-white -mt-6">RESET PASSWORD</h2>
            <p className="text-center text-gray-300 text-sm mb-8">Create a new password</p>
            {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
            <form onSubmit={handleForgotResetSubmit}>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 uppercase font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-70"
              >
                {loading ? 'Updating...' : 'DONE'}
              </button>
            </form>
          </>
        );

      case 'signup':
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-1 text-white -mt-6">CREATE ACCOUNT</h2>
            <p className="text-center text-gray-300 text-sm mb-8">Sign up to get started</p>
            {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}
            <form onSubmit={handleSignupSubmit}>
              <div className="mb-6">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="tel"
                  placeholder="Phone"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 uppercase font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'SIGN UP'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => setView('login')}
                className="text-white text-sm hover:underline"
              >
                Already have an account? Sign In
              </button>
            </div>
          </>
        );

      case 'login':
      default:
        return (
          <>
            <h2 className="text-2xl font-bold text-center mb-1 text-white -mt-6">SIGN IN</h2>
            <p className="text-center text-gray-300 text-sm mb-8">
              {loginMethod === 'password' ? 'via Password' : 'via OTP'}
            </p>

            {error && <p className="text-red-400 text-xs text-center mb-4">{error}</p>}

            <form onSubmit={handleLoginSubmit}>
              {/* Email Input */}
              <div className="mb-6">
                <input
                  type="email"
                  placeholder={loginMethod === 'password' ? "Enter email address" : "Enter email for OTP"}
                  className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {loginMethod === 'otp' && (
                  <p className="text-xs text-gray-400 mt-2">
                    We will send a One Time Password to this email
                  </p>
                )}
              </div>

              {/* Password Input */}
              {loginMethod === 'password' && (
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Enter password"
                    className="w-full border-b border-gray-600 bg-transparent py-2 text-white focus:outline-none focus:border-white placeholder-gray-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <div className="flex justify-between mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setView('forgot-email');
                        setIntent('reset');
                      }}
                      className="text-xs text-gray-400 hover:text-white hover:underline"
                    >
                      Forgot Password?
                    </button>
                    <button
                      type="button"
                      onClick={() => setView('signup')}
                      className="text-xs text-white font-semibold hover:underline"
                    >
                      New User? Sign Up
                    </button>
                  </div>
                </div>
              )}

              {/* Remember Me */}
              <div className="flex items-center mb-6">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 border border-gray-600 rounded mr-2 bg-transparent checked:bg-white check:border-white"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <label htmlFor="remember" className="text-gray-300 text-sm">
                  Remember me
                </label>
              </div>

              {/* Continue Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-3 uppercase font-medium rounded hover:bg-gray-200 transition-colors disabled:opacity-70"
              >
                {loading ? 'Processing...' : 'CONTINUE'}
              </button>
            </form>

            {/* Toggle Method Link */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={toggleMethod}
                className="text-white text-sm hover:underline font-medium"
              >
                {loginMethod === 'password'
                  ? 'Sign in/ Sign up via OTP'
                  : 'Sign in/ Sign up via Password'}
              </button>
            </div>
          </>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70"
      onClick={handleBackdropClick}
    >
      <div
        className="relative text-white max-w-md w-full rounded-lg shadow-xl animate-fade-in border border-gray-800"
        style={{ backgroundColor: 'rgb(0, 0, 0)' }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white z-10"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <div className="px-8 pb-8 pt-2">
          {/* Logo */}
          <div className="flex justify-center mb-0">
            <div className="h-48 w-48 relative">
              {/* Logo - kept original shape but inverted for visibility on dark background */}
              <Image
                src="/images/logo.svg"
                alt="NPlusOne Logo"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {renderContent()}
        </div>
      </div>
    </div>
  );
};


export default LoginModal; 