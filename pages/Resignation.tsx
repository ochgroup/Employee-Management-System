import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { Resignation as ResignationType, Role, Employee } from '../types';
import { CheckIcon, XIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const ResignationForm: React.FC<{
    resignation: ResignationType | null;
    onSave: (data: Omit<ResignationType, 'id' | 'status'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ resignation, onSave, onClose }) => {
    const { user, employees } = useAppContext();
    const currentEmployee = useMemo(() => employees.find(e => e.email === user?.email), [employees, user]);

    const [formData, setFormData] = useState({
        employeeId: resignation?.employeeId || (user?.role === Role.Admin ? (employees[0]?.id || 0) : (currentEmployee?.id || 0)),
        resignationDate: resignation?.resignationDate || new Date().toISOString().split('T')[0],
        lastWorkingDay: resignation?.lastWorkingDay || '',
        reason: resignation?.reason || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: resignation?.id });
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {user?.role === Role.Admin && (
                <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium">Employee</label>
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} required disabled={!!resignation}>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                    </select>
                </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="resignationDate" className="block text-sm font-medium">Resignation Date</label>
                    <input type="date" id="resignationDate" name="resignationDate" value={formData.resignationDate} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="lastWorkingDay" className="block text-sm font-medium">Last Working Day</label>
                    <input type="date" id="lastWorkingDay" name="lastWorkingDay" value={formData.lastWorkingDay} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason for Leaving</label>
                <textarea id="reason" name="reason" rows={3} value={formData.reason} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Submit</button>
            </div>
        </form>
    );
};

const Resignation: React.FC = () => {
    const { user, resignations, setResignations, employees } = useAppContext();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedResignation, setSelectedResignation] = useState<ResignationType | null>(null);
    const [resignationToDelete, setResignationToDelete] = useState<ResignationType | null>(null);

    const currentEmployee = useMemo(() =>
        employees.find(emp => emp.email === user?.email),
        [employees, user]
    );

    const displayedResignations = user?.role === Role.Admin
        ? resignations
        : resignations.filter(req => req.employeeId === currentEmployee?.id);

    const getEmployeeName = (employeeId: number) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    };

    const handleAdd = () => {
        setSelectedResignation(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (resignation: ResignationType) => {
        setSelectedResignation(resignation);
        setIsFormModalOpen(true);
    };

    const handleDelete = (resignation: ResignationType) => {
        setResignationToDelete(resignation);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (resignationToDelete) {
            setResignations(resignations.filter(r => r.id !== resignationToDelete.id));
            setIsDeleteModalOpen(false);
            setResignationToDelete(null);
        }
    };

    const handleSave = (formData: Omit<ResignationType, 'id' | 'status'> & { id?: number }) => {
        if (formData.id) { // Editing
            setResignations(resignations.map(r => r.id === formData.id ? { ...r, ...formData, status: r.status } : r));
        } else { // Creating
            const newResignation: ResignationType = {
                id: Date.now(),
                employeeId: Number(formData.employeeId),
                resignationDate: formData.resignationDate,
                lastWorkingDay: formData.lastWorkingDay,
                reason: formData.reason,
                status: 'Pending',
            };
            setResignations(prev => [newResignation, ...prev]);
        }
        setIsFormModalOpen(false);
    };
    
    const handleStatusChange = (id: number, status: 'Approved' | 'Rejected') => {
        setResignations(resignations.map(r => r.id === id ? { ...r, status } : r));
    };

    const StatusBadge: React.FC<{ status: 'Pending' | 'Approved' | 'Rejected' }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'Approved':
                return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>Approved</span>;
            case 'Rejected':
                return <span className={`${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`}>Rejected</span>;
            default:
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Pending</span>;
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Staff Resignation</h2>
                    <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                        {user?.role === Role.Admin ? 'Add Staff Resignation' : 'Submit Staff Resignation'}
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                {user?.role === Role.Admin && <th scope="col" className="px-6 py-3">Employee</th>}
                                <th scope="col" className="px-6 py-3">Resignation Date</th>
                                <th scope="col" className="px-6 py-3">Last Working Day</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedResignations.map((r) => (
                                <tr key={r.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    {user?.role === Role.Admin && 
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            {getEmployeeName(r.employeeId)}
                                        </td>
                                    }
                                    <td className="px-6 py-4">{r.resignationDate}</td>
                                    <td className="px-6 py-4">{r.lastWorkingDay}</td>
                                    <td className="px-6 py-4">{r.reason}</td>
                                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {user?.role === Role.Admin && r.status === 'Pending' && (
                                                <>
                                                    <button onClick={() => handleStatusChange(r.id, 'Approved')} className="text-green-600 hover:text-green-900" title="Approve"><CheckIcon className="w-5 h-5" /></button>
                                                    <button onClick={() => handleStatusChange(r.id, 'Rejected')} className="text-red-600 hover:text-red-900" title="Reject"><XIcon className="w-5 h-5" /></button>
                                                </>
                                            )}

                                            {(user?.role === Role.Admin || r.status === 'Pending') && (
                                                <button onClick={() => handleEdit(r)} className="text-primary-600 hover:text-primary-900" title="Edit"><PencilIcon className="w-5 h-5"/></button>
                                            )}
                                            
                                            <button onClick={() => handleDelete(r)} className="text-red-600 hover:text-red-900" title="Delete"><TrashIcon className="w-5 h-5"/></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedResignation ? 'Edit Staff Resignation' : (user?.role === Role.Admin ? 'Add Staff Resignation' : 'Submit Staff Resignation')}>
                <ResignationForm resignation={selectedResignation} onSave={handleSave} onClose={() => setIsFormModalOpen(false)} />
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">Are you sure you want to delete this resignation record for <strong>{getEmployeeName(resignationToDelete?.employeeId || 0)}</strong>?</p>
                    <div className="flex justify-end space-x-2">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                        <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Delete</button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default Resignation;