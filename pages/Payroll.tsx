
import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Payroll as PayrollType, Employee, SalaryProfile } from '../types';
import Modal from '../components/Modal';
import SalarySlip from '../components/SalarySlip';
import { formatCurrency } from '../utils/currency';
import { CheckIcon, EyeIcon, DownloadIcon, PencilIcon, TrashIcon, SearchIcon } from '../components/icons/Icons';

const PayrollForm: React.FC<{
    payrollRecord: PayrollType | null;
    onSave: (data: Omit<PayrollType, 'id' | 'status'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ payrollRecord, onSave, onClose }) => {
    const { employees, attendance, salaryProfiles, companyInfo } = useAppContext();
    const [formData, setFormData] = useState({
        employeeId: payrollRecord?.employeeId || employees[0]?.id || 0,
        month: payrollRecord?.month || new Date().getMonth() + 1,
        year: payrollRecord?.year || new Date().getFullYear(),
        basicSalary: payrollRecord?.basicSalary || 0,
        overtime: payrollRecord?.overtime || 0,
        advanced: payrollRecord?.advanced || 0,
        offDay: payrollRecord?.offDay || 0,
        otherDeductions: payrollRecord?.otherDeductions || 0,
    });

    const [salaryProfileId, setSalaryProfileId] = useState<number | undefined>(payrollRecord?.salaryProfileId);
    const [earnings, setEarnings] = useState({
        monday: payrollRecord?.earnings?.monday || 0,
        tuesday: payrollRecord?.earnings?.tuesday || 0,
        wednesday: payrollRecord?.earnings?.wednesday || 0,
        thursday: payrollRecord?.earnings?.thursday || 0,
        friday: payrollRecord?.earnings?.friday || 0,
        saturday: payrollRecord?.earnings?.saturday || 0,
        sunday: payrollRecord?.earnings?.sunday || 0,
    });

    // Initialize profile from employee if new record
    useEffect(() => {
        if (!payrollRecord) {
            const employee = employees.find(e => e.id === Number(formData.employeeId));
            if (employee?.salaryProfileId) {
                setSalaryProfileId(employee.salaryProfileId);
            } else {
                setSalaryProfileId(undefined);
            }
        }
    }, [formData.employeeId, employees, payrollRecord]);

    // Helper to get day key
    const getDayKey = (dateStr: string): keyof SalaryProfile['rates'] => {
        const [y, m, d] = dateStr.split('-').map(Number);
        const date = new Date(y, m - 1, d);
        const day = date.getDay();
        const map: Record<number, keyof SalaryProfile['rates']> = {
            0: 'sunday',
            1: 'monday',
            2: 'tuesday',
            3: 'wednesday',
            4: 'thursday',
            5: 'friday',
            6: 'saturday'
        };
        return map[day];
    }

    // Auto-calculate earnings based on profile and attendance
    useEffect(() => {
        const shouldRecalc = !payrollRecord || 
                             (payrollRecord && (
                                salaryProfileId !== payrollRecord.salaryProfileId || 
                                formData.month !== payrollRecord.month || 
                                formData.year !== payrollRecord.year ||
                                formData.employeeId !== payrollRecord.employeeId
                             ));

        if (shouldRecalc && salaryProfileId) {
            const profile = salaryProfiles.find(p => p.id === Number(salaryProfileId));
            if (profile) {
                const newEarnings = { monday: 0, tuesday: 0, wednesday: 0, thursday: 0, friday: 0, saturday: 0, sunday: 0 };
                
                // Filter attendance for this employee, month, year
                attendance.forEach(att => {
                    const [y, m, d] = att.date.split('-').map(Number);
                    if (att.employeeId === Number(formData.employeeId) && m === Number(formData.month) && y === Number(formData.year)) {
                        const dayKey = getDayKey(att.date);
                        newEarnings[dayKey] += profile.rates[dayKey];
                    }
                });
                
                setEarnings(newEarnings);
            }
        }
    }, [salaryProfileId, formData.month, formData.year, formData.employeeId, attendance, salaryProfiles, payrollRecord]);

    // Update basicSalary when earnings change
    useEffect(() => {
        const totalEarnings = (Object.values(earnings) as number[]).reduce((a, b) => a + b, 0);
        // Only update basic salary if we have a profile selected, otherwise manual entry implies user sets it.
        // Actually, if we have earnings breakdown, basicSalary should match sum.
        if (salaryProfileId || totalEarnings > 0) {
            setFormData(prev => ({ ...prev, basicSalary: totalEarnings }));
        }
    }, [earnings, salaryProfileId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleEarningsChange = (day: keyof typeof earnings, value: string) => {
        setEarnings(prev => ({ ...prev, [day]: parseFloat(value) || 0 }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            ...formData, 
            id: payrollRecord?.id,
            salaryProfileId,
            earnings
        });
    };

    const totalEarnings = (Object.values(earnings) as number[]).reduce((a, b) => a + b, 0);
    const grossSalary = formData.basicSalary + formData.overtime;
    const totalDeductions = formData.advanced + formData.offDay + formData.otherDeductions;
    const netSalary = grossSalary - totalDeductions;

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="border-b pb-4 border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="employeeId" className="block text-sm font-medium mb-1">Employee</label>
                        <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} required disabled={!!payrollRecord}>
                            {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="month" className="block text-sm font-medium mb-1">Month</label>
                            <select name="month" value={formData.month} onChange={handleChange} className={inputClass} required>
                                {monthNames.map((name, index) => <option key={index} value={index+1}>{name}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="year" className="block text-sm font-medium mb-1">Year</label>
                            <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} required />
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                    <label htmlFor="salaryProfileId" className="block text-sm font-medium mb-1">Salary Profile</label>
                    <select 
                        name="salaryProfileId" 
                        value={salaryProfileId ?? ''} 
                        onChange={(e) => setSalaryProfileId(e.target.value ? Number(e.target.value) : undefined)} 
                        className={inputClass}
                    >
                        <option value="">Select Salary Profile</option>
                        {salaryProfiles.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                </div>
            </div>

            <div className="border-b pb-4 border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Working Days & Earnings</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.keys(earnings).map(day => (
                        <div key={day}>
                            <label className="block text-xs font-medium capitalize mb-1">{day}</label>
                            <input 
                                type="number" 
                                value={earnings[day as keyof typeof earnings]} 
                                onChange={(e) => handleEarningsChange(day as keyof typeof earnings, e.target.value)}
                                className={inputClass}
                                min="0"
                            />
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Over Time Pay ({companyInfo.baseCurrency})</label>
                        <input type="number" name="overtime" value={formData.overtime} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Gross Salary</label>
                        <div className="mt-1 block w-full px-3 py-2 bg-slate-100 dark:bg-slate-600 border border-slate-300 dark:border-slate-500 rounded-md text-slate-700 dark:text-slate-200 font-semibold sm:text-sm">
                            {formatCurrency(grossSalary, companyInfo.baseCurrency, companyInfo.baseCurrency)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="border-b pb-4 border-slate-200 dark:border-slate-700">
                <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4">Deductions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Advance ({companyInfo.baseCurrency})</label>
                        <input type="number" name="advanced" value={formData.advanced} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Off Day Deduction ({companyInfo.baseCurrency})</label>
                        <input type="number" name="offDay" value={formData.offDay} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Other Deductions ({companyInfo.baseCurrency})</label>
                        <input type="number" name="otherDeductions" value={formData.otherDeductions} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between bg-slate-100 dark:bg-slate-700 p-4 rounded-lg">
                <span className="text-lg font-bold">Net Salary:</span>
                <span className="text-xl font-bold text-primary-600 dark:text-primary-400">
                    {formatCurrency(netSalary, companyInfo.baseCurrency, companyInfo.baseCurrency)}
                </span>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Record</button>
            </div>
        </form>
    );
};


const Payroll: React.FC = () => {
    const { payroll, setPayroll, employees, companyInfo, displayCurrency } = useAppContext();
    const [isSlipModalOpen, setIsSlipModalOpen] = useState(false);
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [payrollToDelete, setPayrollToDelete] = useState<PayrollType | null>(null);
    const [selectedPayroll, setSelectedPayroll] = useState<{ payroll: PayrollType, employee: Employee } | null>(null);
    const [selectedPayrollRecord, setSelectedPayrollRecord] = useState<PayrollType | null>(null);
    const [searchQuery, setSearchQuery] = useState('');


    const getEmployeeForPayroll = (employeeId: number): Employee | undefined => {
        return employees.find(e => e.id === employeeId);
    };

    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const filteredPayroll = payroll.filter(p => {
        const employee = getEmployeeForPayroll(p.employeeId);
        const query = searchQuery.toLowerCase();
        const employeeName = employee ? `${employee.firstName} ${employee.lastName}`.toLowerCase() : '';
        const department = employee?.department?.toLowerCase() || '';
        const status = p.status.toLowerCase();
        const payPeriod = `${monthNames[p.month]} ${p.year}`.toLowerCase();

        return (
            employeeName.includes(query) ||
            department.includes(query) ||
            status.includes(query) ||
            payPeriod.includes(query)
        );
    });

    const handleViewSlip = (payrollItem: PayrollType) => {
        const employee = getEmployeeForPayroll(payrollItem.employeeId);
        if (employee) {
            setSelectedPayroll({ payroll: payrollItem, employee });
            setIsSlipModalOpen(true);
        } else {
            alert("Employee data not found for this payroll record.");
        }
    };
    
    const handlePay = (payrollId: number) => {
        setPayroll(payroll.map(p => p.id === payrollId ? { ...p, status: 'Paid' } : p));
    };

    const handleAdd = () => {
        setSelectedPayrollRecord(null);
        setIsFormModalOpen(true);
    };
    
    const handleEdit = (payrollItem: PayrollType) => {
        setSelectedPayrollRecord(payrollItem);
        setIsFormModalOpen(true);
    };

    const handleDeleteClick = (payrollItem: PayrollType) => {
        setPayrollToDelete(payrollItem);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (payrollToDelete) {
            setPayroll(payroll.filter(p => p.id !== payrollToDelete.id));
            setIsDeleteModalOpen(false);
            setPayrollToDelete(null);
        }
    };
    
    const handleSave = (formData: Omit<PayrollType, 'id' | 'status'> & { id?: number }) => {
        if (formData.id) { // Editing existing record
            setPayroll(payroll.map(p => p.id === formData.id ? { ...p, ...formData } : p));
        } else { // Creating new record
            const newRecord: PayrollType = {
                id: Date.now(),
                employeeId: Number(formData.employeeId),
                month: Number(formData.month),
                year: Number(formData.year),
                basicSalary: formData.basicSalary,
                overtime: formData.overtime,
                salaryProfileId: formData.salaryProfileId,
                earnings: formData.earnings,
                advanced: formData.advanced,
                offDay: formData.offDay,
                otherDeductions: formData.otherDeductions,
                status: 'Pending',
            };
            setPayroll([newRecord, ...payroll]);
        }
        setIsFormModalOpen(false);
    };


    const handleExportCSV = () => {
        const headers = ['Payroll ID', 'Employee Name', 'Department', 'Month', 'Year', 'Pay (Net Salary)', 'Status'];
        
        const csvRows = filteredPayroll.map(p => {
            const employee = getEmployeeForPayroll(p.employeeId);
            const grossSalary = p.basicSalary + p.overtime;
            const netSalary = grossSalary - p.advanced - p.offDay - p.otherDeductions;
            
            const row = [
                p.id,
                employee ? `${employee.firstName} ${employee.lastName}` : 'N/A',
                employee ? employee.department : 'N/A',
                p.month,
                p.year,
                netSalary,
                p.status
            ];
            return row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'payroll.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
    
    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">Payroll Management</h2>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search payroll..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                        <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2">
                            <DownloadIcon className="w-5 h-5" />
                            <span>Export to CSV</span>
                        </button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                           Generate New Payroll
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee</th>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Pay Period</th>
                                <th scope="col" className="px-6 py-3">Pay</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPayroll.length > 0 ? (
                                filteredPayroll.map((p) => {
                                    const employee = getEmployeeForPayroll(p.employeeId);
                                    const grossSalary = p.basicSalary + p.overtime;
                                    const netSalary = grossSalary - p.advanced - p.offDay - p.otherDeductions;
                                    
                                    return (
                                        <tr key={p.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                            <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                                {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                                            </td>
                                            <td className="px-6 py-4">
                                                {employee?.department || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4">{monthNames[p.month]} {p.year}</td>
                                            <td className="px-6 py-4 font-semibold">{formatCurrency(netSalary, companyInfo.baseCurrency, displayCurrency)}</td>
                                            <td className="px-6 py-4">
                                                <StatusBadge status={p.status} />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center space-x-2">
                                                    <button onClick={() => handleViewSlip(p)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300" title="View Slip">
                                                        <EyeIcon className="w-5 h-5" />
                                                    </button>
                                                    <button onClick={() => handleEdit(p)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="Edit">
                                                        <PencilIcon className="w-5 h-5"/>
                                                    </button>
                                                    {p.status === 'Pending' && (
                                                        <button onClick={() => handlePay(p.id)} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Mark as Paid">
                                                            <CheckIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                     <button onClick={() => handleDeleteClick(p)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        No payroll records found.
                                    </td>
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

            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedPayrollRecord ? 'Edit Payroll Record' : 'Generate New Payroll'}>
                <PayrollForm
                    payrollRecord={selectedPayrollRecord}
                    onSave={handleSave}
                    onClose={() => setIsFormModalOpen(false)}
                />
            </Modal>

             <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete the payroll record for <strong>{getEmployeeForPayroll(payrollToDelete?.employeeId || 0)?.firstName} {getEmployeeForPayroll(payrollToDelete?.employeeId || 0)?.lastName}</strong> for <strong>{monthNames[payrollToDelete?.month || 0]} {payrollToDelete?.year}</strong>? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleConfirmDelete}
                            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Payroll;
