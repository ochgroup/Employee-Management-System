
import React from 'react';
import { useAppContext } from '../App';
import StatCard from '../components/StatCard';
import { UsersIcon, DepartmentIcon, LeaveIcon, PayrollIcon, TrendingUpIcon, AttendanceIcon, LogoutIcon, OfficeBuildingIcon, CreditCardIcon } from '../components/icons/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { Attendance, Role } from '../types';

const calculateTotalOvertime = (attendanceRecords: Attendance[]): string => {
    let totalMinutes = 0;
    
    for (const record of attendanceRecords) {
        if (!record.overtime) continue;

        const hourMatch = record.overtime.match(/(\d+)\s*h/);
        const minuteMatch = record.overtime.match(/(\d+)\s*m/);

        const hours = hourMatch ? parseInt(hourMatch[1], 10) : 0;
        const minutes = minuteMatch ? parseInt(minuteMatch[1], 10) : 0;

        totalMinutes += (hours * 60) + minutes;
    }

    if (totalMinutes === 0) return "0h 0m";

    const finalHours = Math.floor(totalMinutes / 60);
    const finalMinutes = totalMinutes % 60;
    
    return `${finalHours}h ${finalMinutes}m`;
};

const Dashboard: React.FC = () => {
  const { user, employees, departments, leaveRequests, payroll, announcements, companyInfo, displayCurrency, attendance, advanced, resignations } = useAppContext();

  // Helper to get current employee for User Role
  const currentEmployee = employees.find(e => e.email === user?.email);

  // Data Calculation
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const pendingLeave = leaveRequests.filter(req => req.status === 'Pending').length;
  const pendingPayroll = payroll.filter(p => p.status === 'Pending').length;
  const pendingResignations = resignations.filter(r => r.status === 'Pending').length;

  const monthlyPayrollTotal = payroll
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => {
        const grossSalary = p.basicSalary + p.overtime;
        return acc + grossSalary;
    }, 0);

  // Calculate approved advances (outstanding)
  const totalAdvanced = advanced
    .filter(a => a.status === 'Approved')
    .reduce((acc, a) => acc + a.amount, 0);
  
  const totalOvertime = calculateTotalOvertime(attendance);

  const departmentData = departments.map(dept => ({
    name: dept.name,
    employees: employees.filter(emp => emp.department === dept.name && emp.status === 'Active').length,
  }));
  
  // User specific data
  const myPendingLeaves = leaveRequests.filter(req => req.employeeId === currentEmployee?.id && req.status === 'Pending').length;
  const myResignation = resignations.find(r => r.employeeId === currentEmployee?.id);
  const myResignationStatus = myResignation ? myResignation.status : 'Not Submitted';
  
  const unreadAnnouncements = announcements.length; 

  return (
    <div className="space-y-6">
      {/* Dashboard Heading */}
      <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>

      {user?.role === Role.Admin ? (
          /* --- ADMIN VIEW --- */
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Total Employees" 
                    value={activeEmployees} 
                    icon={<UsersIcon className="w-8 h-8 text-blue-500" />} 
                />
                <StatCard 
                    title="Total Departments" 
                    value={departments.length} 
                    icon={<OfficeBuildingIcon className="w-8 h-8 text-emerald-500" />} 
                />
                <StatCard 
                    title="Pending Leave" 
                    value={pendingLeave} 
                    icon={<LeaveIcon className="w-8 h-8 text-amber-500" />} 
                    className="border-amber-400 dark:border-amber-500 border-2"
                />
                <StatCard 
                    title="Pending Payroll" 
                    value={pendingPayroll} 
                    icon={<PayrollIcon className="w-8 h-8 text-red-500" />} 
                />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="Monthly Payroll" 
                    value={formatCurrency(monthlyPayrollTotal, companyInfo.baseCurrency, displayCurrency)} 
                    icon={<CreditCardIcon className="w-8 h-8 text-indigo-600" />} 
                />
                <StatCard 
                    title="Advanced" 
                    value={formatCurrency(totalAdvanced, companyInfo.baseCurrency, displayCurrency)} 
                    icon={<TrendingUpIcon className="w-8 h-8 text-purple-500" />} 
                />
                <StatCard 
                    title="Over Time" 
                    value={totalOvertime}
                    icon={<AttendanceIcon className="w-8 h-8 text-pink-500" />}
                />
                <StatCard 
                    title="Staff Resignation" 
                    value={pendingResignations}
                    icon={<LogoutIcon className="w-8 h-8 text-slate-500" />}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Employees by Department</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={departmentData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip
                        cursor={{fill: '#f1f5f9'}}
                        contentStyle={{
                            backgroundColor: '#fff',
                            borderColor: '#e2e8f0',
                            color: '#1e293b',
                            borderRadius: '0.5rem',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <Bar dataKey="employees" fill="#64748b" radius={[4, 4, 0, 0]} barSize={50} />
                    </BarChart>
                </ResponsiveContainer>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 flex flex-col">
                    <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Recent Announcements</h2>
                    {announcements.length > 0 ? (
                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {announcements.slice(0, 5).map(announcement => (
                                <div key={announcement.id} className="p-4 rounded-lg bg-white dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:border-slate-200 dark:hover:border-slate-600 transition-colors shadow-sm">
                                    <div className="flex flex-col items-start mb-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-primary-300 text-sm line-clamp-1">{announcement.title}</h3>
                                    </div>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{announcement.content}</p>
                                    <span className="text-xs text-slate-400 whitespace-nowrap">{announcement.date}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                         <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
                             <p>No recent announcements.</p>
                         </div>
                    )}
                </div>
            </div>
          </>
      ) : (
          /* --- EMPLOYEE VIEW --- */
          <>
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    title="My Department" 
                    value={currentEmployee?.department || 'N/A'} 
                    icon={<DepartmentIcon className="w-8 h-8 text-emerald-500" />} 
                />
                <StatCard 
                    title="Pending Leaves" 
                    value={myPendingLeaves} 
                    icon={<LeaveIcon className="w-8 h-8 text-amber-500" />} 
                />
                <StatCard 
                    title="Resignation Status" 
                    value={myResignationStatus} 
                    icon={<LogoutIcon className="w-8 h-8 text-slate-500" />} 
                />
                <StatCard 
                    title="Unread Announcements" 
                    value={unreadAnnouncements} 
                    icon={<UsersIcon className="w-8 h-8 text-blue-500" />} 
                />
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6">
                <h2 className="text-lg font-semibold mb-6 text-slate-900 dark:text-white">Recent Announcements</h2>
                {announcements.length > 0 ? (
                    <div className="space-y-4">
                        {announcements.map(announcement => (
                             <div key={announcement.id} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50">
                                <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-2">
                                    <h3 className="font-medium text-slate-900 dark:text-primary-300 text-base">{announcement.title}</h3>
                                    <span className="text-xs text-slate-500">{announcement.date}</span>
                                </div>
                                <p className="text-sm text-slate-500 dark:text-slate-400">{announcement.content}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                     <div className="text-center py-12 text-slate-500">
                        <p>No recent announcements.</p>
                     </div>
                )}
            </div>
          </>
      )}
    </div>
  );
};

export default Dashboard;
