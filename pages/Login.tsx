// FIX: Corrected import statement for React and useState.
import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAppContext } from '../App';
import { Role } from '../types';
import AuthLayout from '../layouts/AuthLayout';

const Login: React.FC = () => {
    const { role } = useParams<{ role: string }>();
    const loginRole = role?.toLowerCase() === 'admin' ? Role.Admin : Role.User;

    const [email, setEmail] = useState(loginRole === Role.Admin ? 'admin@example.com' : 'user@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const { login } = useAppContext();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        const success = login(email, password, loginRole);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid email or password for this role.');
        }
    };

    const title = loginRole === Role.Admin ? "Admin Sign-In" : "User Sign-In";
    const inputClass = "block w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-md placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-900 dark:text-white";

    return (
        <AuthLayout title={title}>
             {error && <p className="mb-4 text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-md">{error}</p>}
                
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Email address
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={inputClass}
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                        Password
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className={inputClass}
                        placeholder="••••••••"
                    />
                </div>
                
                <div className="pt-2">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Sign in
                    </button>
                </div>
            </form>
            
            <p className="pt-6 text-sm text-center text-slate-500 dark:text-slate-400">
                <Link to="/" className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                    &larr; Back to role selection
                </Link>
            </p>
        </AuthLayout>
    );
};

export default Login;