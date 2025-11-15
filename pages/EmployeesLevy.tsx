
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { EmployeeLevy, Employee } from '../types';
import Modal from '../components/Modal';
import { PencilIcon, TrashIcon, CheckIcon, XIcon, SearchIcon, DownloadIcon } from '../components/icons/Icons';
import { formatCurrency } from '../utils/currency';

const EmployeeLevyForm: React.FC<{
    record: EmployeeLevy | null;
    onSave: (data: Omit<EmployeeLevy, 'id'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ record, onSave, onClose }) => {
    const { employees, levies, companyInfo } = useAppContext();
    
    // Defaults
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    // Use string for amount to handle decimal input comfortably
    const [formData, setFormData] = useState({
        employeeId: record?.employeeId || employees[0]?.id || 0,
        levyId: record?.levyId || levies[0]?.id || 0,
        month: record?.month || currentMonth,
        year: record?.year || currentYear,
        amount: record?.amount !== undefined ? record.amount.toString() : '',
        status: record?.status || 'Pending' as 'Pending' | 'Paid'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (['employeeId', 'levyId', 'month', 'year'].includes(name)) {
             setFormData(prev => ({ ...prev, [name]: Number(value) }));
        } else {
             setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ 
            ...formData, 
            amount: parseFloat(formData.amount) || 0,
            id: record?.id 
        });
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="employeeId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Employee</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} required disabled={!!record}>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
            </div>
            <div>
                <label htmlFor="levyId" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Levy Type</label>
                 <select name="levyId" value={formData.levyId} onChange={handleChange} className={inputClass} required>
                    <option value={0}>Select Levy Type...</option>
                    {levies.map(l => <option key={l.id} value={l.id}>{l.name} ({l.percentage}%)</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="month" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Month</label>
                    <select name="month" value={formData.month} onChange={handleChange} className={inputClass} required>
                        {monthNames.map((name, index) => <option key={index} value={index+1}>{name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="year" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Year</label>
                    <input type="number" name="year" value={formData.year} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Pay Amount ({companyInfo.baseCurrency})</label>
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={inputClass} min="0" step="0.01" required />
            </div>
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className={inputClass} required>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
            </div>
        </form>
    );
};

const EmployeesLevy: React.FC = () => {
    const { employeeLevies, setEmployeeLevies, employees, companyInfo, displayCurrency, levies } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState<EmployeeLevy | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [recordToDelete, setRecordToDelete] = useState<EmployeeLevy | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const getEmployee = (id: number) => employees.find(e => e.id === id);
    const monthNames = ["", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const filteredLevies = employeeLevies.filter(record => {
        const employee = getEmployee(record.employeeId);
        if (!employee) return false;
        
        const query = searchQuery.toLowerCase();
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        
        return (
            fullName.includes(query) || 
            employee.email.toLowerCase().includes(query) ||
            employee.department.toLowerCase().includes(query)
        );
    });

    const handleAdd = () => {
        setSelectedRecord(null);
        setIsModalOpen(true);
    };

    const handleEdit = (record: EmployeeLevy) => {
        setSelectedRecord(record);
        setIsModalOpen(true);
    };

    const handleDelete = (record: EmployeeLevy) => {
        setRecordToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (recordToDelete) {
            setEmployeeLevies(employeeLevies.filter(l => l.id !== recordToDelete.id));
            setIsDeleteModalOpen(false);
            setRecordToDelete(null);
        }
    };

    const handleSave = (data: Omit<EmployeeLevy, 'id'> & { id?: number }) => {
        if (data.id) {
            setEmployeeLevies(employeeLevies.map(l => l.id === data.id ? { ...l, ...data } as EmployeeLevy : l));
        } else {
            const newRecord: EmployeeLevy = {
                ...data,
                id: Date.now(),
            };
            setEmployeeLevies([newRecord, ...employeeLevies]);
        }
        setIsModalOpen(false);
    };
    
    const handleStatusChange = (id: number, status: 'Pending' | 'Paid') => {
        setEmployeeLevies(employeeLevies.map(r => r.id === id ? { ...r, status } : r));
    };

    const handleExportCSV = () => {
        const headers = ['Employee Name', 'Department', 'Levy Type', 'Month', 'Year', `Amount (${companyInfo.baseCurrency})`, 'Status'];
        
        const csvRows = filteredLevies.map(record => {
            const employee = getEmployee(record.employeeId);
            const levy = levies.find(l => l.id === record.levyId);
            
            const row = [
                employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown',
                employee?.department || 'N/A',
                levy ? levy.name : 'Unknown',
                monthNames[record.month],
                record.year,
                record.amount,
                record.status
            ];
            return row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'employee_levies.csv');
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
            default:
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Pending</span>;
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Employees Levy</h2>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search employee..."
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
                            Add Employee Levy
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
                            {filteredLevies.length > 0 ? filteredLevies.map((record) => {
                                const employee = getEmployee(record.employeeId);
                                return (
                                    <tr key={record.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                            {employee ? (
                                                <div className="flex items-center">
                                                    <img className="w-8 h-8 rounded-full mr-2" src={employee.avatar} alt="Avatar" />
                                                    <div>
                                                        <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                                                        <div className="text-xs text-slate-500">{employee.email}</div>
                                                    </div>
                                                </div>
                                            ) : 'Unknown'}
                                        </td>
                                        <td className="px-6 py-4">{employee?.department || 'N/A'}</td>
                                        <td className="px-6 py-4">{monthNames[record.month]} {record.year}</td>
                                        <td className="px-6 py-4 font-semibold">{formatCurrency(record.amount, companyInfo.baseCurrency, displayCurrency)}</td>
                                        <td className="px-6 py-4">
                                            <StatusBadge status={record.status} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {record.status === 'Pending' && (
                                                    <button onClick={() => handleStatusChange(record.id, 'Paid')} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Mark as Paid">
                                                        <CheckIcon className="w-5 h-5" />
                                                    </button>
                                                )}
                                                <button onClick={() => handleEdit(record)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="Edit">
                                                    <PencilIcon className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => handleDelete(record)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                    <TrashIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No employee levy records found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedRecord ? 'Edit Employee Levy' : 'Add Employee Levy'}>
                <EmployeeLevyForm record={selectedRecord} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete this levy record? This action cannot be undone.
                    </p>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EmployeesLevy;
