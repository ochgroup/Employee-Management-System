import React from 'react';
import { useAppContext } from '../App';
import StatCard from '../components/StatCard';
import { UsersIcon, DepartmentIcon, LeaveIcon, PayrollIcon, CashIcon, TrendingUpIcon, AttendanceIcon, LogoutIcon } from '../components/icons/Icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { Attendance } from '../types';

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
  const { employees, departments, leaveRequests, payroll, announcements, companyInfo, displayCurrency, attendance, advanced, resignations } = useAppContext();

  const pendingLeave = leaveRequests.filter(req => req.status === 'Pending').length;
  const pendingPayroll = payroll.filter(p => p.status === 'Pending').length;
  const pendingResignations = resignations.filter(r => r.status === 'Pending').length;

  const monthlyPayrollTotal = payroll
    .filter(p => p.status === 'Paid')
    .reduce((acc, p) => {
        const grossSalary = p.basicSalary + p.overtime;
        return acc + grossSalary;
    }, 0);
  
  const totalOvertime = calculateTotalOvertime(attendance);

  const totalAdvanced = advanced
    .filter(a => a.status === 'Approved')
    .reduce((acc, a) => acc + a.amount, 0);

  const departmentData = departments.map(dept => ({
    name: dept.name,
    employees: employees.filter(emp => emp.department === dept.name).length,
  }));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<UsersIcon className="w-8 h-8 text-blue-500" />} 
          title="Total Employees" 
          value={employees.length} 
          borderColorClass="border-blue-500"
        />
        <StatCard 
          icon={<DepartmentIcon className="w-8 h-8 text-green-500" />} 
          title="Total Departments" 
          value={departments.length} 
          borderColorClass="border-green-500"
        />
        <StatCard 
          icon={<LeaveIcon className="w-8 h-8 text-yellow-500" />} 
          title="Pending Leave" 
          value={pendingLeave} 
          borderColorClass="border-yellow-500"
        />
        <StatCard 
          icon={<PayrollIcon className="w-8 h-8 text-red-500" />} 
          title="Pending Payroll" 
          value={pendingPayroll} 
          borderColorClass="border-red-500"
        />
         <StatCard 
          icon={<CashIcon className="w-8 h-8 text-indigo-500" />} 
          title="Monthly Payroll" 
          value={formatCurrency(monthlyPayrollTotal, companyInfo.baseCurrency, displayCurrency)} 
          borderColorClass="border-indigo-500"
        />
        <StatCard 
          icon={<TrendingUpIcon className="w-8 h-8 text-purple-500" />} 
          title="Advanced" 
          value={formatCurrency(totalAdvanced, companyInfo.baseCurrency, displayCurrency)}
          borderColorClass="border-purple-500"
        />
        <StatCard 
          icon={<AttendanceIcon className="w-8 h-8 text-pink-500" />} 
          title="Over Time" 
          value={totalOvertime}
          borderColorClass="border-pink-500"
        />
        <StatCard 
          icon={<LogoutIcon className="w-8 h-8 text-gray-500" />} 
          title="Staff Resignation" 
          value={pendingResignations}
          borderColorClass="border-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Employees by Department</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-slate-200 dark:stroke-slate-700" />
              <XAxis dataKey="name" className="text-xs text-slate-600 dark:text-slate-400" />
              <YAxis className="text-xs text-slate-600 dark:text-slate-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(30, 41, 59, 0.9)',
                  borderColor: '#334155',
                  color: '#ffffff',
                  borderRadius: '0.5rem',
                }}
              />
              <Legend />
              <Bar dataKey="employees" fill="#64748b" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
          <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Recent Announcements</h2>
          <ul className="space-y-4">
            {announcements.slice(0, 4).map(announcement => (
              <li key={announcement.id}>
                <h3 className="font-semibold text-primary-600 dark:text-primary-400">{announcement.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{announcement.content.substring(0, 50)}...</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{announcement.date}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;