import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Department } from '../types';
import Modal from '../components/Modal';
import { PencilIcon, TrashIcon } from '../components/icons/Icons';

const DepartmentForm: React.FC<{
    department: Department | null;
    onSave: (departmentData: Omit<Department, 'id'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ department, onSave, onClose }) => {
    const [name, setName] = useState('');

    useEffect(() => {
        if (department) {
            setName(department.name);
        } else {
            setName('');
        }
    }, [department]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ name });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm font-medium">Department Name</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save</button>
            </div>
        </form>
    );
}

const Departments: React.FC = () => {
    const { departments, setDepartments } = useAppContext();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [departmentToDelete, setDepartmentToDelete] = useState<Department | null>(null);


    const handleDeleteClick = (department: Department) => {
        setDepartmentToDelete(department);
        setIsDeleteModalOpen(true);
    };
    
    const handleConfirmDelete = () => {
        if (departmentToDelete) {
            setDepartments(departments.filter(d => d.id !== departmentToDelete.id));
            setIsDeleteModalOpen(false);
            setDepartmentToDelete(null);
        }
    };

    const handleAdd = () => {
        setSelectedDepartment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setIsModalOpen(true);
    };

    const handleSave = (departmentData: Omit<Department, 'id'> & { id?: number }) => {
        if (selectedDepartment) {
            setDepartments(departments.map(d => d.id === selectedDepartment.id ? { ...selectedDepartment, ...departmentData } : d));
        } else {
            const newDepartment: Department = {
                id: Date.now(),
                name: departmentData.name,
            };
            setDepartments([newDepartment, ...departments]);
        }
        setIsModalOpen(false);
    };

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Manage Departments</h2>
                    <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                        Add Department
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Department Name</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {departments.map((department: Department) => (
                                <tr key={department.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                                        {department.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleEdit(department)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="Edit">
                                                <PencilIcon className="w-5 h-5"/>
                                            </button>
                                            <button onClick={() => handleDeleteClick(department)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
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
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedDepartment ? 'Edit Department' : 'Add Department'}>
                <DepartmentForm department={selectedDepartment} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
            </Modal>
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete the department "<strong>{departmentToDelete?.name}</strong>"? This action cannot be undone.
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

export default Departments;