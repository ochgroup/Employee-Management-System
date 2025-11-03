import React, { useState, useMemo } from 'react';
import { useAppContext } from '../App';
import { LeaveRequest, Role } from '../types';
import { CheckIcon, XIcon, TrashIcon } from '../components/icons/Icons';
import Modal from '../components/Modal';

const LeaveRequestForm: React.FC<{
    onSave: (data: { startDate: string; endDate: string; reason: string }) => void;
    onClose: () => void;
}> = ({ onSave, onClose }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reason, setReason] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ startDate, endDate, reason });
    };
    
    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="startDate" className="block text-sm font-medium">Start Date</label>
                    <input type="date" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="endDate" className="block text-sm font-medium">End Date</label>
                    <input type="date" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="reason" className="block text-sm font-medium">Reason</label>
                <textarea id="reason" rows={3} value={reason} onChange={(e) => setReason(e.target.value)} className={inputClass} required />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Submit Request</button>
            </div>
        </form>
    );
};

const Leave: React.FC = () => {
    const { user, leaveRequests, setLeaveRequests, employees } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [leaveRequestToDelete, setLeaveRequestToDelete] = useState<LeaveRequest | null>(null);

    const currentEmployee = useMemo(() => // FIX: Look up employee by email for consistency and reliability
        employees.find(emp => emp.email === user?.email),
        [employees, user]
    );

    const displayedLeaveRequests = user?.role === Role.Admin
        ? leaveRequests
        : leaveRequests.filter(req => req.employeeId === currentEmployee?.id);

    const handleStatusChange = (id: number, status: 'Approved' | 'Rejected') => {
        setLeaveRequests(leaveRequests.map(req => req.id === id ? { ...req, status } : req));
    };
    
    const handleRequestSave = (data: { startDate: string; endDate: string; reason: string }) => {
        if (currentEmployee) {
            const newRequest: LeaveRequest = {
                id: Date.now(),
                employeeId: currentEmployee.id,
                status: 'Pending',
                ...data,
            };
            setLeaveRequests(prev => [newRequest, ...prev]);
        }
        setIsModalOpen(false);
    };

    const handleDeleteClick = (request: LeaveRequest) => {
        setLeaveRequestToDelete(request);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (leaveRequestToDelete) {
            setLeaveRequests(leaveRequests.filter(req => req.id !== leaveRequestToDelete.id));
            setIsDeleteModalOpen(false);
            setLeaveRequestToDelete(null);
        }
    };

    const getEmployeeName = (employeeId: number) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
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
                    <h2 className="text-xl font-semibold">Leave Requests</h2>
                    {user?.role === Role.User && (
                         <button onClick={() => setIsModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Request Leave
                        </button>
                    )}
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                {user?.role === Role.Admin && <th scope="col" className="px-6 py-3">Employee</th>}
                                <th scope="col" className="px-6 py-3">Start Date</th>
                                <th scope="col" className="px-6 py-3">End Date</th>
                                <th scope="col" className="px-6 py-3">Reason</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedLeaveRequests.map((request: LeaveRequest) => (
                                <tr key={request.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    {user?.role === Role.Admin && 
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            {getEmployeeName(request.employeeId)}
                                        </td>
                                    }
                                    <td className="px-6 py-4">{request.startDate}</td>
                                    <td className="px-6 py-4">{request.endDate}</td>
                                    <td className="px-6 py-4">{request.reason}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={request.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            {user?.role === Role.Admin ? (
                                                <>
                                                    {request.status === 'Pending' && (
                                                        <>
                                                            <button onClick={() => handleStatusChange(request.id, 'Approved')} className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300" title="Approve">
                                                                <CheckIcon className="w-5 h-5" />
                                                            </button>
                                                            <button onClick={() => handleStatusChange(request.id, 'Rejected')} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Reject">
                                                                <XIcon className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    )}
                                                    <button onClick={() => handleDeleteClick(request)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                        <TrashIcon className="w-5 h-5" />
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {request.status === 'Pending' && (
                                                        <button onClick={() => handleDeleteClick(request)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Withdraw Request">
                                                            <TrashIcon className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Leave Request">
                <LeaveRequestForm onSave={handleRequestSave} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete the leave request for <strong>{getEmployeeName(leaveRequestToDelete?.employeeId || 0)}</strong> from <strong>{leaveRequestToDelete?.startDate}</strong> to <strong>{leaveRequestToDelete?.endDate}</strong>? This action cannot be undone.
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

export default Leave;