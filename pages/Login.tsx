import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../App';
import { Role } from '../types';
import AuthLayout from '../layouts/AuthLayout';

const Login: React.FC = () => {
    const { role } = useParams<{ role: string }>();
    const loginRole = role?.toLowerCase() === 'admin' ? Role.Admin : Role.User;

    const [email, setEmail] = useState(loginRole === Role.Admin ? 'admin@s7.com' : 'employee@s7.com');
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

    const title = "Sign In";
    const subtitle = `as ${loginRole === Role.Admin ? 'Admin' : 'Employee'}`;
    const inputClass = "block w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-white transition-all";
    const labelClass = "block text-sm font-medium text-slate-300 mb-1.5";

    return (
        <AuthLayout 
            title={title} 
            subtitle={subtitle}
            backLink="/"
            backLinkText="Back to role selection"
        >
             {error && <div className="mb-6 text-red-400 text-sm bg-red-900/20 border border-red-900/50 p-3 rounded-lg flex items-center"><span className="mr-2">⚠️</span> {error}</div>}
                
            <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email" className={labelClass}>
                        Email
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
                        placeholder="name@company.com"
                    />
                </div>
                <div>
                    <label htmlFor="password" className={labelClass}>
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
                
                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-lg shadow-primary-900/30 text-sm font-bold text-white bg-primary-600 hover:bg-primary-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;