import React from 'react';
import { OfficeBuildingIcon } from '../components/icons/Icons';
import { useAppContext } from '../App';

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
    const { companyInfo } = useAppContext();
    
    return (
        <div className="flex min-h-screen bg-white dark:bg-slate-900">
            {/* Left Panel - Branding */}
            <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-indigo-600 to-indigo-800 p-12 text-white relative overflow-hidden">
                <div className="z-10 text-center">
                    {companyInfo.logo ? (
                        <img src={companyInfo.logo} alt="Company Logo" className="w-24 h-24 mx-auto mb-6 object-contain bg-white/20 p-2 rounded-lg shadow-md" />
                    ) : (
                        <OfficeBuildingIcon className="w-24 h-24 mx-auto mb-6 text-indigo-300" />
                    )}
                    <h1 className="text-4xl font-bold mb-2 tracking-tight">{companyInfo.name}</h1>
                    <p className="text-lg text-indigo-200">Your all-in-one solution for HR management.</p>
                </div>
                 {/* Decorative shapes */}
                <div className="absolute top-0 left-0 w-48 h-48 bg-indigo-500/30 rounded-full -translate-x-1/3 -translate-y-1/3"></div>
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/30 rounded-full translate-x-1/4 translate-y-1/4"></div>
            </div>
            
            {/* Right Panel - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
                <div className="w-full max-w-md">
                    {/* Mobile Header */}
                    <div className="lg:hidden text-center mb-10">
                         {companyInfo.logo ? (
                            <img src={companyInfo.logo} alt="Company Logo" className="w-16 h-16 mx-auto mb-4 object-contain" />
                        ) : (
                            <OfficeBuildingIcon className="w-16 h-16 mx-auto mb-4 text-indigo-500" />
                        )}
                        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{companyInfo.name}</h1>
                    </div>
                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white">{title}</h2>
                        {subtitle && <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{subtitle}</p>}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AuthLayout;