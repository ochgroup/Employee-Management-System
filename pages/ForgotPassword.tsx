import React from 'react';
import { Link } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';

const ForgotPassword: React.FC = () => {
    // In a real app, this would handle form state and submission
    return (
        <AuthLayout 
            title="Forgot your password?" 
            subtitle="Enter your email and we'll send you a link to get back into your account."
        >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                        Email address
                    </label>
                    <input
                        id="email" name="email" type="email" autoComplete="email" required
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                    />
                </div>
                <div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    >
                        Send reset link
                    </button>
                </div>
            </form>
            <p className="mt-8 text-sm text-center text-gray-600 dark:text-gray-400">
                Remembered your password?{' '}
                <Link to="/" className="font-medium text-primary-600 hover:text-primary-500">
                    Sign in
                </Link>
            </p>
        </AuthLayout>
    );
};

export default ForgotPassword;