import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Employee } from '../types';
import Modal from '../components/Modal';
import { PencilIcon, TrashIcon, DownloadIcon, SpinnerIcon, SearchIcon } from '../components/icons/Icons';
import { formatCurrency } from '../utils/currency';

const EmployeeForm: React.FC<{
    employee: Employee | null;
    onSave: (employeeData: Partial<Employee>) => void;
    onClose: () => void;
}> = ({ employee, onSave, onClose }) => {
    const { departments, companyInfo } = useAppContext();
    const [formData, setFormData] = useState({
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        department: departments[0]?.name || '',
        salary: 0,
        birthday: '',
        experience: 0,
        avatar: '',
        status: 'Pending' as Employee['status'],
        ...employee
    });
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        if (employee) {
            setFormData({...employee});
        }
    }, [employee]);
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsUploading(true);

            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_SIZE = 200;
                    
                    let startX = 0, startY = 0;
                    let size = Math.min(img.width, img.height);
                    
                    if (img.width > img.height) {
                        startX = (img.width - img.height) / 2;
                    } else {
                        startY = (img.height - img.width) / 2;
                    }
                    
                    canvas.width = MAX_SIZE;
                    canvas.height = MAX_SIZE;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, startX, startY, size, size, 0, 0, MAX_SIZE, MAX_SIZE);
                    
                    const dataUrl = canvas.toDataURL('image/jpeg');
                    setFormData(prev => ({ ...prev, avatar: dataUrl }));
                    setIsUploading(false);
                };
                img.onerror = () => {
                    console.error("Error loading image for processing.");
                    setIsUploading(false);
                };
                img.src = event.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'number' ? parseFloat(value) : value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        const saveData: Partial<Employee> = { ...formData };
        if (password) {
            saveData.password = password;
        }
        onSave(saveData);
    };
    
    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 flex items-center space-x-4">
                    <img 
                        className="w-20 h-20 rounded-full object-cover" 
                        src={formData.avatar || `https://i.pravatar.cc/150?u=${formData.username || 'default'}`} 
                        alt="Avatar" 
                    />
                    <div className="flex items-center space-x-2">
                        <label className={`cursor-pointer bg-slate-200 dark:bg-slate-700 px-3 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <span>Change Photo</span>
                            <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={isUploading} />
                        </label>
                         {isUploading && <SpinnerIcon className="w-5 h-5 animate-spin text-primary-500" />}
                    </div>
                </div>
                <div>
                    <label htmlFor="firstName" className="block text-sm font-medium">First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="lastName" className="block text-sm font-medium">Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium">Username</label>
                    <input type="text" name="username" value={formData.username} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required={!employee} placeholder={employee ? 'Leave blank to keep current' : ''}/>
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required={!employee} />
                </div>
                <div>
                    <label htmlFor="department" className="block text-sm font-medium">Department</label>
                    <select name="department" value={formData.department} onChange={handleChange} className={inputClass} required>
                        {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="salary" className="block text-sm font-medium">Annual Salary ({companyInfo.baseCurrency})</label>
                    <input type="number" name="salary" value={formData.salary} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="birthday" className="block text-sm font-medium">Birthday</label>
                    <input type="date" name="birthday" value={formData.birthday} onChange={handleChange} className={inputClass} required />
                </div>
                <div>
                    <label htmlFor="experience" className="block text-sm font-medium">Experience (years)</label>
                    <input type="number" name="experience" value={formData.experience} onChange={handleChange} className={inputClass} required />
                </div>
                 <div>
                    <label htmlFor="status" className="block text-sm font-medium">Status</label>
                    <select name="status" value={formData.status} onChange={handleChange} className={inputClass} required>
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
            </div>
        </form>
    );
};


const Employees: React.FC = () => {
    const { employees, setEmployees, companyInfo, displayCurrency } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmployees = employees.filter(employee => {
        const searchTerm = searchQuery.toLowerCase();
        const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
        return (
            fullName.includes(searchTerm) ||
            employee.email.toLowerCase().includes(searchTerm) ||
            employee.department.toLowerCase().includes(searchTerm)
        );
    });

    const handleDeleteClick = (employee: Employee) => {
        setEmployeeToDelete(employee);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (employeeToDelete) {
            setEmployees(employees.filter(e => e.id !== employeeToDelete.id));
            setIsDeleteModalOpen(false);
            setEmployeeToDelete(null);
        }
    };

    const handleAdd = () => {
        setSelectedEmployee(null);
        setIsModalOpen(true);
    };

    const handleEdit = (employee: Employee) => {
        setSelectedEmployee(employee);
        setIsModalOpen(true);
    };

    const handleSave = (formData: Partial<Employee>) => {
        if (selectedEmployee) {
            setEmployees(employees.map(e => e.id === selectedEmployee.id ? { ...e, ...formData } : e));
        } else {
            const newEmployee: Employee = {
                ...formData,
                id: Date.now(),
                avatar: formData.avatar || `https://i.pravatar.cc/150?u=${formData.username}`,
            } as Employee;
            setEmployees([newEmployee, ...employees]);
        }
        setIsModalOpen(false);
    };

    const handleExportCSV = () => {
        const headers = ['ID', 'Username', 'First Name', 'Last Name', 'Email', 'Department', `Salary (${companyInfo.baseCurrency})`, 'Birthday', 'Experience (years)', 'Status'];
        
        const csvRows = filteredEmployees.map(emp => {
            const row = [
                emp.id,
                emp.username,
                emp.firstName,
                emp.lastName,
                emp.email,
                emp.department,
                emp.salary,
                emp.birthday,
                emp.experience,
                emp.status
            ];
            return row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',');
        });

        const csvContent = [headers.join(','), ...csvRows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'employees.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const StatusBadge: React.FC<{ status: 'Pending' | 'Active' | 'Inactive' }> = ({ status }) => {
        const baseClasses = "px-2 py-1 text-xs font-semibold rounded-full";
        switch (status) {
            case 'Active':
                return <span className={`${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`}>Active</span>;
            case 'Inactive':
                return <span className={`${baseClasses} bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300`}>Inactive</span>;
            case 'Pending':
                return <span className={`${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`}>Pending</span>;
        }
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-semibold">Manage Employees</h2>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <div className="relative">
                             <input
                                type="text"
                                placeholder="Search..."
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
                            Add Employee
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Employee ID</th>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Department</th>
                                <th scope="col" className="px-6 py-3">Experience</th>
                                <th scope="col" className="px-6 py-3">Salary</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredEmployees.map((employee: Employee) => (
                                <tr key={employee.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <td className="px-6 py-4">{employee.id.toString().padStart(4, '0')}</td>
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                        <div className="flex items-center">
                                            <img className="w-10 h-10 rounded-full mr-3 object-cover" src={employee.avatar} alt={`${employee.firstName} ${employee.lastName}`} />
                                            <div>
                                                <div>{employee.firstName} {employee.lastName}</div>
                                                <div className="text-xs text-slate-500">{employee.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{employee.department}</td>
                                    <td className="px-6 py-4">{employee.experience} years</td>
                                    <td className="px-6 py-4">{formatCurrency(employee.salary, companyInfo.baseCurrency, displayCurrency)}</td>
                                    <td className="px-6 py-4">
                                        <StatusBadge status={employee.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleEdit(employee)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="Edit">
                                                <PencilIcon className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleDeleteClick(employee)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                <TrashIcon className="w-5 h-5"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedEmployee ? 'Edit Employee' : 'Add Employee'}>
                <EmployeeForm employee={selectedEmployee} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete the employee <strong>{employeeToDelete?.firstName} {employeeToDelete?.lastName}</strong>? This action cannot be undone.
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

export default Employees;