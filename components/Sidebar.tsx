import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../App';
import { Role } from '../types';
import {
  DashboardIcon, UsersIcon, DepartmentIcon, LeaveIcon, PayrollIcon,
  AttendanceIcon, AnnouncementIcon, UserCircleIcon, XIcon, OfficeBuildingIcon, SettingsIcon,
  CashIcon, LogoutIcon
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
  { to: '/departments', icon: DepartmentIcon, label: 'Departments' },
  { to: '/leave', icon: LeaveIcon, label: 'Leave Requests' },
  { to: '/resignation', icon: LogoutIcon, label: 'Staff Resignation' },
  { to: '/payroll', icon: PayrollIcon, label: 'Payroll' },
  { to: '/advanced', icon: CashIcon, label: 'Advanced' },
  { to: '/attendance', icon: AttendanceIcon, label: 'Attendance' },
  { to: '/settings', icon: SettingsIcon, label: 'Settings' },
];

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setSidebarOpen }) => {
  const { user, companyInfo } = useAppContext();
  
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

  const linkClass = "flex items-center px-4 py-2.5 text-slate-300 hover:bg-slate-700 hover:text-white rounded-md transition-colors duration-200";
  const activeLinkClass = "bg-slate-800 text-white";

  const SidebarContent = () => (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between p-4 text-white">
            <div className="flex items-center">
                {companyInfo.logo ? (
                    <img src={companyInfo.logo} alt="Company Logo" className="w-8 h-8 mr-3 object-contain" />
                ) : (
                    <OfficeBuildingIcon className="w-8 h-8 mr-3 text-slate-400" />
                )}
                <span className="text-xl font-bold">{companyInfo.name}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white"
            >
              <XIcon className="w-6 h-6" />
            </button>
        </div>
        <nav className="mt-6 px-2">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-30 bg-black bg-opacity-50 transition-opacity lg:hidden duration-300 ${
          isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 transform transition-transform lg:hidden duration-300 ease-in-out ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 bg-slate-900">
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;