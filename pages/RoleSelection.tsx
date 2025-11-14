import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Role } from '../types';
import { UserCircleIcon, UsersIcon, CheckIcon } from '../components/icons/Icons';

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();
    const { companyInfo } = useAppContext();

    const handleRoleSelection = (role: Role) => {
        navigate(`/login/${role.toLowerCase()}`);
    };

    const RoleCard: React.FC<{
        title: string;
        description: string;
        icon: React.ReactNode;
        onClick: () => void;
        iconBg: string;
        iconColor: string;
    }> = ({ title, description, icon, onClick, iconBg, iconColor }) => (
        <div
            onClick={onClick}
            className="group w-full sm:w-80 bg-slate-800 rounded-2xl border border-slate-700 p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary-500 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary-900/20"
        >
            <div className={`mx-auto w-20 h-20 mb-6 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 ${iconBg}`}>
                <div className={iconColor}>
                    {icon}
                </div>
            </div>
            <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
            <p className="text-sm text-slate-400 leading-relaxed">{description}</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0f172a] flex flex-col items-center justify-center p-6">
            <div className="text-center mb-12 animate-fade-in-up">
                <div className="w-16 h-16 bg-primary-600 rounded-xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-primary-900/50 rotate-3">
                    <CheckIcon className="w-8 h-8 text-white" strokeWidth={3} />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 tracking-tight">STUDIO SEVEN SDN BHD</h1>
                <p className="text-slate-400 text-lg">Welcome! Please select your role to continue.</p>
            </div>
            
            <div className="flex flex-col md:flex-row gap-6 justify-center w-full max-w-4xl">
                <RoleCard
                    title="Admin Team"
                    description="Manage employees, payroll, and company settings."
                    icon={<UserCircleIcon className="w-10 h-10" />}
                    iconBg="bg-indigo-900/50"
                    iconColor="text-indigo-400"
                    onClick={() => handleRoleSelection(Role.Admin)}
                />
                <RoleCard
                    title="Employee User"
                    description="Access profile, leave requests, and salary slips."
                    icon={<UsersIcon className="w-10 h-10" />}
                    iconBg="bg-primary-900/50"
                    iconColor="text-primary-400"
                    onClick={() => handleRoleSelection(Role.User)}
                />
            </div>
        </div>
    );
};

export default RoleSelection;