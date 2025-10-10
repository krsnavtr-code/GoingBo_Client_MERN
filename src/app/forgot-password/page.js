'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authAPI } from '@/services/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [canResendOTP, setCanResendOTP] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP and new password
    const router = useRouter();

    // Handle countdown for resend OTP
    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        } else if (countdown === 0 && !canResendOTP) {
            setCanResendOTP(true);
        }
        return () => clearTimeout(timer);
    }, [countdown, canResendOTP]);

    const startResendCooldown = () => {
        setCanResendOTP(false);
        setCountdown(30);
    };

    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await authAPI.forgotPassword(email);
            if (response.status === 'success') {
                setMessage('OTP has been sent to your email.');
                setStep(2);
                startResendCooldown();
            }
        } catch (error) {
            setError(error.message || 'Failed to send OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = async () => {
        if (!canResendOTP) return;
        
        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            const response = await authAPI.forgotPassword(email);
            if (response.status === 'success') {
                setMessage('New OTP has been sent to your email.');
                startResendCooldown();
            }
        } catch (error) {
            setError(error.message || 'Failed to resend OTP. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setError('');
        setMessage('');
        setIsLoading(true);

        try {
            // First verify the OTP to get the reset token
            const verifyResponse = await authAPI.verifyOTP(email, otp);
            
            if (verifyResponse.status === 'success' && verifyResponse.resetToken) {
                // Use the resetToken from the verify response to reset the password
                const resetResponse = await authAPI.resetPassword(
                    verifyResponse.resetToken, 
                    newPassword, 
                    confirmPassword
                );
                
                if (resetResponse.status === 'success') {
                    setMessage('Password has been reset successfully. Redirecting to login...');
                    setTimeout(() => {
                        router.push('/login');
                    }, 2000);
                }
            }
        } catch (error) {
            setError(error.message || 'Failed to reset password. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStepOne = () => (
        <>
            <div>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
                    Forgot your password?
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-300">
                    Enter your email and we&apos;ll send you an OTP to reset your password.
                </p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{error}</span>
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label htmlFor="email-address" className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email-address"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                </div>
            </form>
        </>
    );
    const renderStepTwo = () => (
        <>
            <div>
                <h2 className="mt-6 text-center text-2xl font-extrabold text-gray-900 dark:text-white">
                    Reset Your Password
                </h2>
                <div className="mt-2 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        We&apos;ve sent a 6-digit OTP to {email}
                    </p>
                    <div className="mt-2">
                        {canResendOTP ? (
                            <button
                                type="button"
                                onClick={handleResendOTP}
                                className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 focus:outline-none cursor-pointer"
                                disabled={isLoading}
                            >
                                Didn&apos;t receive code? Resend OTP
                            </button>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer">
                                Resend OTP in {countdown}s
                            </p>
                        )}
                    </div>
                </div>
            </div>
            {message && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                    <span className="block sm:inline">{message}</span>
                </div>
            )}

            <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                <div className="rounded-md shadow-sm space-y-4">
                    <div>
                        <label htmlFor="otp" className="sr-only">
                            OTP
                        </label>
                        <input
                            id="otp"
                            name="otp"
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength="6"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                            placeholder="Enter 6-digit OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                    </div>

                    <div>
                        <label htmlFor="new-password" className="sr-only">
                            New Password
                        </label>
                        <input
                            id="new-password"
                            name="newPassword"
                            type="password"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm-password" className="sr-only">
                            Confirm New Password
                        </label>
                        <input
                            id="confirm-password"
                            name="confirmPassword"
                            type="password"
                            required
                            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="button"
                        onClick={() => {
                            setStep(1);
                            setError('');
                            setMessage('');
                        }}
                        className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                        disabled={isLoading}
                    >
                        ← Back
                    </button>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
            <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                {step === 1 ? renderStepOne() : renderStepTwo()}

                {step === 1 && (
                    <div className="text-sm text-center">
                        Got your password back?{" "}
                        <Link
                            href="/login"
                            className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                            Log In 🚀
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
