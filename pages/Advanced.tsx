import React, { useState } from 'react';
import { useAppContext } from '../App';
import { Advanced as AdvancedType } from '../types';
import Modal from '../components/Modal';
import { formatCurrency } from '../utils/currency';
import { CheckIcon, XIcon, PencilIcon, TrashIcon, DownloadIcon } from '../components/icons/Icons';

const AdvancedForm: React.FC<{
    advancedRecord: AdvancedType | null;
    onSave: (data: Omit<AdvancedType, 'id' | 'status'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ advancedRecord, onSave, onClose }) => {
    const { employees } = useAppContext();
    const [formData, setFormData] = useState({
        employeeId: advancedRecord?.employeeId || employees[0]?.id || 0,
        amount: advancedRecord?.amount || 0,
        date: advancedRecord?.date || new Date().toISOString().split('T')[0],
        reason: advancedRecord?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) || 0 : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: advancedRecord?.id });
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="employeeId" className="block text-sm font-medium">Employee</label>
                <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} required disabled={!!advancedRecord}>
                    {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium">Amount</label>
                    <input type="number" name="amount" value={formData.amount} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium">Date</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
                <textarea name="reason" rows={3} value={formData.reason} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
            </div>
        </form>
    );
};

const Advanced: React.FC = () => {
    const { advanced, setAdvanced, employees, companyInfo, displayCurrency } = useAppContext();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAdvanced, setSelectedAdvanced] = useState<AdvancedType | null>(null);
    const [advancedToDelete, setAdvancedToDelete] = useState<AdvancedType | null>(null);

    const getEmployeeName = (employeeId: number) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    };

    const handleAdd = () => {
        setSelectedAdvanced(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (record: AdvancedType) => {
        setSelectedAdvanced(record);
        setIsFormModalOpen(true);
    };

    const handleDelete = (record: AdvancedType) => {
        setAdvancedToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (advancedToDelete) {
            setAdvanced(advanced.filter(a => a.id !== advancedToDelete.id));
            setIsDeleteModalOpen(false);
            setAdvancedToDelete(null);
        }
    };

    const handleSave = (formData: Omit<AdvancedType, 'id' | 'status'> & { id?: number }) => {
        if (formData.id) { // Editing
            setAdvanced(advanced.map(a => a.id === formData.id ? { ...a, ...formData } : a));
        } else { // Creating
            const newRecord: AdvancedType = {
                id: Date.now(),
                employeeId: Number(formData.employeeId),
                amount: formData.amount,
                date: formData.date,
                reason: formData.reason,
                status: 'Pending',
            };
            setAdvanced([newRecord, ...advanced]);
        }
        setIsFormModalOpen(false);
    };
    
    const handleStatusChange = (id: number, status: AdvancedType['status']) => {
        setAdvanced(advanced.map(a => a.id === id ? { ...a, status } : a));
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Employee Name', 'Amount', 'Date', 'Reason', 'Status'];
        const csvRows = advanced.map(a => {
            const row = [
                a.id,
                getEmployeeName(a.employeeId),
                a.amount,
                a.date,
                a.reason,
                a.status,
            ];
            return row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
        });
        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'employee_advances.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatusBadge: React.FC<{ status: AdvancedType['status'] }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'Approved':
                return <span className={`${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`}>Approved</span>;
            case 'Repaid':
                return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>Repaid</span>;
            case 'Rejected':
                return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>Rejected</span>;
            default:
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Pending</span>;
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">Advanced</h2>
                    <div className="flex items-center space-x-2">
                        <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2">
                            <DownloadIcon className="w-5 h-5" />
                            <span>Export to CSV</span>
                        </button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                           Add Advance
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {advanced.map((a) => (
                                <tr key={a.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">{getEmployeeName(a.employeeId)}</td>
                                    <td className="px-6 py-4">{a.date}</td>
                                    <td className="px-6 py-4 font-semibold">{formatCurrency(a.amount, companyInfo.baseCurrency, displayCurrency)}</td>
                                    <td className="px-6 py-4">{a.reason}</td>
                                    <td className="px-6 py-4"><StatusBadge status={a.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {a.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(a.id, 'Approved')} className="text-green-600 hover:text-green-900" title="Approve"><CheckIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleStatusChange(a.id, 'Rejected')} className="text-red-600 hover:text-red-900" title="Reject"><XIcon className="w-5 h-5" /></button>
                                                </>
                                            )}
                                            {a.status === 'Approved' && (
                                                <button onClick={() => handleStatusChange(a.id, 'Repaid')} className="text-green-600 hover:text-green-900 text-xs font-semibold px-2 py-1 rounded bg-green-100 dark:bg-green-900" title="Mark as Repaid">REPAID</button>
                                            )}
                                            <button onClick={() => handleEdit(a)} className="text-primary-600 hover:text-primary-900" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                            <button onClick={() => handleDelete(a)} className="text-red-600 hover:text-red-900" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedAdvanced ? 'Edit Advance' : 'Add Advance'}>
                <AdvancedForm advancedRecord={selectedAdvanced} onSave={handleSave} onClose={() => setIsFormModalOpen(false)} />
            </Modal>
            
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">Are you sure you want to delete this advance record for <strong>{getEmployeeName(advancedToDelete?.employeeId || 0)}</strong>?</p>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Advanced;