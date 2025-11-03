import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../App';
import { Role } from '../types';
import { SettingsIcon, UserCircleIcon, OfficeBuildingIcon } from '../components/icons/Icons';

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
    }> = ({ title, description, icon, onClick }) => (
        <div
            onClick={onClick}
            className="group w-full sm:w-72 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 p-8 text-center cursor-pointer transition-all duration-300 ease-in-out hover:shadow-lg hover:border-primary-500 dark:hover:border-primary-500 hover:-translate-y-2"
        >
            <div className="mx-auto w-16 h-16 mb-6 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center transition-colors group-hover:bg-primary-100 dark:group-hover:bg-primary-900/50">
                {icon}
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-white mb-2">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
    );

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900 p-4">
            <div className="text-center mb-12">
                {companyInfo.logo ? (
                    <img src={companyInfo.logo} alt="Company Logo" className="w-20 h-20 mx-auto mb-4 object-contain" />
                ) : (
                    <OfficeBuildingIcon className="w-20 h-20 mx-auto mb-4 text-primary-500" />
                )}
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{companyInfo.name}</h1>
                <p className="text-lg text-slate-600 dark:text-slate-400 mt-2">Welcome! Please select your role to continue.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
                <RoleCard
                    title="Admin team"
                    description="Manage employees, payroll, and company settings."
                    icon={<SettingsIcon className="w-8 h-8 text-slate-500 dark:text-slate-400 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400" />}
                    onClick={() => handleRoleSelection(Role.Admin)}
                />
                <RoleCard
                    title="Employee User"
                    description="Access your profile, leave requests, and salary slips."
                    icon={<UserCircleIcon className="w-8 h-8 text-slate-500 dark:text-slate-400 transition-colors group-hover:text-primary-600 dark:group-hover:text-primary-400" />}
                    onClick={() => handleRoleSelection(Role.User)}
                />
            </div>
        </div>
    );
};

export default RoleSelection;