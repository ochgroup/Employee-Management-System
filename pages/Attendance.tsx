import React, { useState, useMemo, useEffect } from 'react';
import { useAppContext } from '../App';
import { Attendance as AttendanceType, Role, User, Employee } from '../types';
import Modal from '../components/Modal';
import { DownloadIcon, PencilIcon, TrashIcon } from '../components/icons/Icons';

const AttendanceForm: React.FC<{
    attendanceRecord: AttendanceType | null;
    onSave: (attendanceData: Omit<AttendanceType, 'id'>) => void;
    onClose: () => void;
    user: User | null;
    currentEmployee: Employee | undefined;
}> = ({ onSave, onClose, user, currentEmployee, attendanceRecord }) => {
    const { employees } = useAppContext();

    const getInitialFormData = () => {
        if (attendanceRecord) {
            return {
                employeeId: attendanceRecord.employeeId,
                date: attendanceRecord.date,
                clockIn: attendanceRecord.clockIn,
                clockOut: attendanceRecord.clockOut,
                overtime: attendanceRecord.overtime || '',
            };
        }
        return {
            employeeId: user?.role === Role.Admin ? (employees[0]?.id || 0) : (currentEmployee?.id || 0),
            date: new Date().toISOString().split('T')[0],
            clockIn: '09:00',
            clockOut: '17:00',
            overtime: '',
        };
    };
    
    const [formData, setFormData] = useState(getInitialFormData());
    
    useEffect(() => {
        setFormData(getInitialFormData());
    }, [attendanceRecord, employees, currentEmployee, user]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseInt(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {user?.role === Role.Admin && (
                 <div>
                    <label htmlFor="employeeId" className="block text-sm font-medium">Employee</label>
                    <select name="employeeId" value={formData.employeeId} onChange={handleChange} className={inputClass} required disabled={!!attendanceRecord}>
                        {employees.map(e => <option key={e.id} value={e.id}>{e.firstName} {e.lastName}</option>)}
                    </select>
                </div>
            )}
            <div>
                <label htmlFor="date" className="block text-sm font-medium">Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={inputClass} required />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="clockIn" className="block text-sm font-medium">Clock In</label>
                    <input type="time" name="clockIn" value={formData.clockIn} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="clockOut" className="block text-sm font-medium">Clock Out</label>
                    <input type="time" name="clockOut" value={formData.clockOut} onChange={handleChange} className={inputClass} required />
                </div>
            </div>
            <div>
                <label htmlFor="overtime" className="block text-sm font-medium">Over Time (optional)</label>
                <input type="text" name="overtime" value={formData.overtime} onChange={handleChange} className={inputClass} placeholder="e.g., 2h 30m" />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">{attendanceRecord ? 'Save Changes' : 'Add'}</button>
            </div>
        </form>
    );
};

const Attendance: React.FC = () => {
    const { user, attendance, setAttendance, employees } = useAppContext();
    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedAttendance, setSelectedAttendance] = useState<AttendanceType | null>(null);
    const [attendanceToDelete, setAttendanceToDelete] = useState<AttendanceType | null>(null);

    const currentEmployee = useMemo(() => // FIX: Look up employee by email for consistency and reliability
        employees.find(emp => emp.email === user?.email),
        [employees, user]
    );

    const displayedAttendance = user?.role === Role.Admin
        ? attendance
        : attendance.filter(a => a.employeeId === currentEmployee?.id);

    const getEmployeeName = (employeeId: number) => {
        const employee = employees.find(e => e.id === employeeId);
        return employee ? `${employee.firstName} ${employee.lastName}` : 'Unknown';
    };
    
    const handleAdd = () => {
        setSelectedAttendance(null);
        setIsFormModalOpen(true);
    };

    const handleEdit = (record: AttendanceType) => {
        setSelectedAttendance(record);
        setIsFormModalOpen(true);
    };

    const handleDelete = (record: AttendanceType) => {
        setAttendanceToDelete(record);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (attendanceToDelete) {
            setAttendance(attendance.filter(a => a.id !== attendanceToDelete.id));
            setIsDeleteModalOpen(false);
            setAttendanceToDelete(null);
        }
    };

    const handleSave = (formData: Omit<AttendanceType, 'id'>) => {
        const attendanceData = {
            ...formData,
            employeeId: Number(formData.employeeId),
        };

        if (selectedAttendance) {
            setAttendance(attendance.map(a => a.id === selectedAttendance.id ? { ...a, ...attendanceData } : a));
        } else {
            const newAttendance: AttendanceType = {
                ...attendanceData,
                id: Date.now(),
            };
            setAttendance([newAttendance, ...attendance]);
        }
        setIsFormModalOpen(false);
        setSelectedAttendance(null);
    };

    const handleExportCSV = () => {
        const headers = ['Employee ID', 'Employee Name', 'Date', 'Clock In', 'Clock Out', 'Over Time'];
        
        const csvRows = displayedAttendance.map(att => {
            const row = [
                att.employeeId,
                getEmployeeName(att.employeeId),
                att.date,
                att.clockIn,
                att.clockOut,
                att.overtime || ''
            ];
            return row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'attendance.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-2">
                    <h2 className="text-xl font-semibold">Attendance Management</h2>
                    <div className="flex items-center space-x-2">
                         <button onClick={handleExportCSV} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center space-x-2">
                            <DownloadIcon className="w-5 h-5" />
                            <span>Export to CSV</span>
                        </button>
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Add Attendance
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                {user?.role === Role.Admin && <th scope="col" className="px-6 py-3">Employee</th>}
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Clock In</th>
                                <th scope="col" className="px-6 py-3">Clock Out</th>
                                <th scope="col" className="px-6 py-3">Over Time</th>
                                {user?.role === Role.Admin && <th scope="col" className="px-6 py-3">Action</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {displayedAttendance.map((a: AttendanceType) => (
                                <tr key={a.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    {user?.role === Role.Admin && (
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                            {getEmployeeName(a.employeeId)}
                                        </td>
                                    )}
                                    <td className="px-6 py-4">{a.date}</td>
                                    <td className="px-6 py-4">{a.clockIn}</td>
                                    <td className="px-6 py-4">{a.clockOut}</td>
                                    <td className="px-6 py-4">{a.overtime || '—'}</td>
                                    {user?.role === Role.Admin && (
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button onClick={() => handleEdit(a)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="Edit">
                                                    <PencilIcon className="w-5 h-5"/>
                                                </button>
                                                <button onClick={() => handleDelete(a)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                    <TrashIcon className="w-5 h-5"/>
                                                </button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} title={selectedAttendance ? "Edit Attendance Record" : "Add Attendance Record"}>
                <AttendanceForm 
                    attendanceRecord={selectedAttendance}
                    onSave={handleSave} 
                    onClose={() => setIsFormModalOpen(false)}
                    user={user}
                    currentEmployee={currentEmployee}
                />
            </Modal>
             <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete this attendance record for <strong>{getEmployeeName(attendanceToDelete?.employeeId || 0)}</strong> on <strong>{attendanceToDelete?.date}</strong>? This action cannot be undone.
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

export default Attendance;