import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { Payroll as PayrollType, Employee } from '../types';
import Modal from '../components/Modal';
import SalarySlip from '../components/SalarySlip';
import { formatCurrency } from '../utils/currency';
import { EyeIcon } from '../components/icons/Icons';

const MyPayroll: React.FC = () => {
    const { user, payroll, employees, companyInfo, displayCurrency } = useAppContext();
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
    const [selectedPayroll, setSelectedPayroll] = useState<{ payroll: PayrollType, employee: Employee } | null>(null);

    // Using email to find the employee record for the logged-in user for better accuracy
    const currentEmployee = useMemo(() => 
        employees.find(emp => emp.email === user?.email), 
        [employees, user]
    );

    const userPayroll = useMemo(() => {
        if (!currentEmployee) return [];
        return payroll.filter(p => p.employeeId === currentEmployee.id);
    }, [payroll, currentEmployee]);

    const handleViewSlip = (payrollItem: PayrollType) => {
        if (currentEmployee) {
            setSelectedPayroll({ payroll: payrollItem, employee: currentEmployee });
            setIsSlipModalOpen(true);
        } else {
            alert("Could not find your employee data.");
        }
    };

    const StatusBadge: React.FC<{ status: 'Pending' | 'Paid' }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'Paid':
                return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>Paid</span>;
            case 'Pending':
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Pending</span>;
        }
    };
    
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Salary Slips</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Pay Period</th>
                                <th scope="col" className="px-6 py-3">Gross Salary</th>
                                <th scope="col" className="px-6 py-3">Net Salary</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userPayroll.length > 0 ? userPayroll.map((p) => {
                                const grossSalary = p.basicSalary + p.overtime;
                                const netSalary = grossSalary - p.advanced - p.offDay - p.otherDeductions;
                                
                                return (
                                    <tr key={p.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                        <td className="px-6 py-4">{monthNames[p.month]} {p.year}</td>
                                        <td className="px-6 py-4">{formatCurrency(grossSalary, companyInfo.baseCurrency, displayCurrency)}</td>
                                        <td className="px-6 py-4 font-semibold">{formatCurrency(netSalary, companyInfo.baseCurrency, displayCurrency)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={p.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleViewSlip(p)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View Slip">
                                                    <EyeIcon className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">No payroll records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <Modal isOpen={isSlipModalOpen} onClose={() => setIsSlipModalOpen(false)} title="Salary Slip">
                {selectedPayroll && (
                    <SalarySlip 
                        payroll={selectedPayroll.payroll} 
                        employee={selectedPayroll.employee}
                        companyInfo={companyInfo}
                    />
                )}
            </Modal>
        </>
    );
};

export default MyPayroll;