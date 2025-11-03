import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Payroll as PayrollType, Employee } from '../types';
import Modal from '../components/Modal';
import SalarySlip from '../components/SalarySlip';
import { formatCurrency } from '../utils/currency';
import { CheckIcon, EyeIcon, DownloadIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';

const PayrollForm: React.FC<{
    payrollRecord: PayrollType | null;
    onSave: (data: Omit<PayrollType, 'id' | 'status'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ payrollRecord, onSave, onClose }) => {
    const { employees } = useAppContext();
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

    useEffect(() => {
        if (payrollRecord) {
            setFormData({
                employeeId: payrollRecord.employeeId,
                month: payrollRecord.month,
                year: payrollRecord.year,
                basicSalary: payrollRecord.basicSalary,
                overtime: payrollRecord.overtime,
                advanced: payrollRecord.advanced,
                offDay: payrollRecord.offDay,
                otherDeductions: payrollRecord.otherDeductions
            });
        }
    }, [payrollRecord]);
    
    useEffect(() => {
        if (!payrollRecord) { // Auto-populate only for new records
            const selectedEmployee = employees.find(e => e.id === Number(formData.employeeId));
            if (selectedEmployee) {
                const monthlySalary = selectedEmployee.salary / 12;
                setFormData(prev => ({
                    ...prev,
                    basicSalary: Math.round(monthlySalary),
                    overtime: 0,
                    advanced: 0,
                    offDay: 0,
                    otherDeductions: 0,
                }));
            }
        }
    }, [formData.employeeId, employees, payrollRecord]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: payrollRecord?.id });
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="employeeId" className="block text-sm font-medium">Employee</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} required disabled={!!payrollRecord}>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label htmlFor="month" className="block text-sm font-medium">Month</label>
                    <select name="month" value={formData.month} onChange={handleChange} className={inputClass} required>
                        {monthNames.map((name, index) => <option key={index} value={index+1}>{name}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="year" className="block text-sm font-medium">Year</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <fieldset className="border p-4 rounded-md dark:border-slate-600">
                <legend className="text-sm font-medium px-2">Earnings</legend>
                <div className="space-y-2">
                    <div>
                        <label className="block text-xs font-medium">Basic Salary</label>
                        <input type="number" name="basicSalary" value={formData.basicSalary} onChange={handleChange} className={inputClass} />
                    </div>
                     <div>
                        <label className="block text-xs font-medium">Over Time</label>
                        <input type="number" name="overtime" value={formData.overtime} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </fieldset>
             <fieldset className="border p-4 rounded-md dark:border-slate-600">
                <legend className="text-sm font-medium px-2">Deductions</legend>
                <div className="space-y-2">
                    <div>
                        <label className="block text-xs font-medium">Advanced</label>
                        <input type="number" name="advanced" value={formData.advanced} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium">Off Day</label>
                        <input type="number" name="offDay" value={formData.offDay} onChange={handleChange} className={inputClass} />
                    </div>
                    <div>
                        <label className="block text-xs font-medium">Other Deductions</label>
                        <input type="number" name="otherDeductions" value={formData.otherDeductions} onChange={handleChange} className={inputClass} />
                    </div>
                </div>
            </fieldset>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
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


    const getEmployeeForPayroll = (employeeId: number): Employee | undefined => {
        return employees.find(e => e.id === employeeId);
    };

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
        const headers = ['Payroll ID', 'Employee Name', 'Month', 'Year', 'Gross Salary', 'Net Salary', 'Status'];
        
        const csvRows = payroll.map(p => {
            const employee = getEmployeeForPayroll(p.employeeId);
            const grossSalary = p.basicSalary + p.overtime;
            const netSalary = grossSalary - p.advanced - p.offDay - p.otherDeductions;
            
            const row = [
                p.id,
                employee ? `${employee.firstName} ${employee.lastName}` : 'N/A',
                p.month,
                p.year,
                grossSalary,
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
    
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">Payroll Management</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2">
                            <DownloadIcon className="w-5 h-5" />
                            <span>Export to CSV</span>
                        </button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                           Create Payroll
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee</th>
                                <th scope="col" className="px-6 py-3">Pay Period</th>
                                <th scope="col" className="px-6 py-3">Gross Salary</th>
                                <th scope="col" className="px-6 py-3">Net Salary</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payroll.map((p) => {
                                const employee = getEmployeeForPayroll(p.employeeId);
                                const grossSalary = p.basicSalary + p.overtime;
                                const netSalary = grossSalary - p.advanced - p.offDay - p.otherDeductions;
                                
                                return (
                                    <tr key={p.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            {employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown Employee'}
                                        </td>
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
                            })}
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

            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedPayrollRecord ? 'Edit Payroll Record' : 'Create Payroll Record'}>
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