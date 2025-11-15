import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../App';
import { Role } from '../types';
import {
  DashboardIcon, UsersIcon, DepartmentIcon, LeaveIcon, PayrollIcon,
  AttendanceIcon, AnnouncementIcon, UserCircleIcon, XIcon, SettingsIcon,
  CashIcon, LogoutIcon, DocumentTextIcon, ScaleIcon
} from './icons/Icons';

interface SidebarProps {
  isSidebarOpen: boolean;
  setSidebarOpen: (isOpen: boolean) => void;
}

const commonLinks = [
  { to: '/dashboard', icon: DashboardIcon, label: 'Dashboard' },
  { to: '/announcements', icon: AnnouncementIcon, label: 'Announcements' },
  { to: '/profile', icon: UserCircleIcon, label: 'Profile' },
];

const adminLinks = [
  { to: '/employees', icon: UsersIcon, label: 'Employees' },
  { to: '/salary-profiles', icon: DocumentTextIcon, label: 'Salary Profiles' },
  { to: '/departments', icon: DepartmentIcon, label: 'Departments' },
  { to: '/employees-levy', icon: ScaleIcon, label: 'Employees Levy' },
  { to: '/leave', icon: LeaveIcon, label: 'Leave Requests' },
  { to: '/resignation', icon: LogoutIcon, label: 'Staff Resignation' },
  { to: '/payroll', icon: PayrollIcon, label: 'Payroll' },
  { to: '/advanced', icon: CashIcon, label: 'Advanced' },
  { to: '/attendance', icon: AttendanceIcon, label: 'Attendance' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user, companyInfo, logout } = useAppContext();
  
  const userNavLinks = [
    commonLinks[0], // Dashboard
    { to: '/leave', icon: LeaveIcon, label: 'Leave Requests' },
    { to: '/resignation', icon: LogoutIcon, label: 'Staff Resignation' },
    { to: '/attendance', icon: AttendanceIcon, label: 'Attendance' },
    { to: '/my-payroll', icon: PayrollIcon, label: 'Salary Slips' },
    ...commonLinks.slice(1) // Announcements, Profile
  ];

  const adminNavLinks = [...commonLinks.slice(0, 1), ...adminLinks, ...commonLinks.slice(1)];

  const links = user?.role === Role.Admin ? adminNavLinks : userNavLinks;

  const linkClass = "flex items-center px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200 mb-1 mx-2";
  const activeLinkClass = "bg-primary-600 text-white hover:bg-primary-700 shadow-md shadow-primary-900/20";

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 border-r border-slate-800">
      <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
        <div className="flex items-center mb-8 px-2">
            <h1 className="text-xl font-bold text-primary-500 tracking-wider uppercase">
                {companyInfo.name.split(' ')[0]} <span className="text-white">SEVEN</span>
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden ml-auto text-slate-400 hover:text-white"
            >
              <XIcon className="w-6 h-6" />
            </button>
        </div>
        <p className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">Menu</p>
        <nav>
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-slate-800">
        <button
            onClick={() => {
                logout();
                setSidebarOpen(false);
            }}
            className="flex items-center w-full px-4 py-3 text-slate-400 hover:bg-slate-800 hover:text-white rounded-lg transition-all duration-200"
        >
            <LogoutIcon className="w-5 h-5 mr-3" />
            <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity lg:hidden duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-slate-900 transform transition-transform lg:hidden duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-72">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;