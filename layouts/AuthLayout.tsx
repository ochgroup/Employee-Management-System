import React from 'react';
import { OfficeBuildingIcon, CheckIcon } from '../components/icons/Icons';
import { useAppContext } from '../App';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
    backLink?: string;
    backLinkText?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle, backLink, backLinkText }) => {
    const { companyInfo } = useAppContext();
    
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0f172a] p-4 sm:p-6">
            <div className="flex flex-col md:flex-row w-full max-w-4xl bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-700">
                
                {/* Left Side - Branding */}
                <div className="hidden md:flex w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
                     <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                     <div className="z-10 flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                             <CheckIcon className="w-10 h-10 text-white" strokeWidth={3} />
                        </div>
                        <h1 className="text-3xl font-bold mb-2 tracking-wide">STUDIO</h1>
                        <p className="text-primary-100 font-medium">Employee Management System</p>
                     </div>
                     {/* Decorative circles */}
                     <div className="absolute -top-12 -left-12 w-40 h-40 bg-primary-500/30 rounded-full blur-2xl"></div>
                     <div className="absolute -bottom-12 -right-12 w-40 h-40 bg-primary-500/30 rounded-full blur-2xl"></div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-8 sm:p-12 bg-slate-800 text-white flex flex-col justify-center">
                     {backLink && (
                        <Link to={backLink} className="text-slate-400 hover:text-white text-sm mb-8 flex items-center transition-colors">
                            &larr; {backLinkText || "Back"}
                        </Link>
                    )}

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                        {subtitle && <p className="text-slate-400">{subtitle}</p>}
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;