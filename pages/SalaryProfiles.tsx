
import React, { useState } from 'react';
import { useAppContext } from '../App';
import { SalaryProfile } from '../types';
import Modal from '../components/Modal';
import { PencilIcon, TrashIcon, SearchIcon } from '../components/icons/Icons';
import { formatCurrency } from '../utils/currency';

const SalaryProfileForm: React.FC<{
    profile: SalaryProfile | null;
    onSave: (data: Omit<SalaryProfile, 'id'> & { id?: number }) => void;
    onClose: () => void;
}> = ({ profile, onSave, onClose }) => {
    const { companyInfo } = useAppContext();
    const [name, setName] = useState(profile?.name || '');
    const [rates, setRates] = useState({
        monday: profile?.rates.monday || 0,
        tuesday: profile?.rates.tuesday || 0,
        wednesday: profile?.rates.wednesday || 0,
        thursday: profile?.rates.thursday || 0,
        friday: profile?.rates.friday || 0,
        saturday: profile?.rates.saturday || 0,
        sunday: profile?.rates.sunday || 0,
    });

    const handleRateChange = (day: keyof typeof rates, value: string) => {
        setRates(prev => ({
            ...prev,
            [day]: parseFloat(value) || 0
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            name,
            rates,
            id: profile?.id
        });
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm";
    const currencyLabel = `(${companyInfo.baseCurrency})`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="profileName" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Profile Name</label>
                <input
                    type="text"
                    id="profileName"
                    placeholder="e.g., Standard Rate"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass}
                    required
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.keys(rates).map((day) => (
                    <div key={day}>
                        <label htmlFor={day} className="block text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                            {day} {currencyLabel}
                        </label>
                        <input
                            type="number"
                            id={day}
                            value={rates[day as keyof typeof rates]}
                            onChange={(e) => handleRateChange(day as keyof typeof rates, e.target.value)}
                            className={inputClass}
                            min="0"
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
            </div>
        </form>
    );
};

const SalaryProfiles: React.FC = () => {
    const { salaryProfiles, setSalaryProfiles, companyInfo, displayCurrency } = useAppContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<SalaryProfile | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [profileToDelete, setProfileToDelete] = useState<SalaryProfile | null>(null);

    const filteredProfiles = salaryProfiles.filter(profile => 
        profile.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAdd = () => {
        setSelectedProfile(null);
        setIsModalOpen(true);
    };

    const handleEdit = (profile: SalaryProfile) => {
        setSelectedProfile(profile);
        setIsModalOpen(true);
    };

    const handleDelete = (profile: SalaryProfile) => {
        setProfileToDelete(profile);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (profileToDelete) {
            setSalaryProfiles(salaryProfiles.filter(p => p.id !== profileToDelete.id));
            setIsDeleteModalOpen(false);
            setProfileToDelete(null);
        }
    };

    const handleSave = (data: Omit<SalaryProfile, 'id'> & { id?: number }) => {
        if (data.id) {
            setSalaryProfiles(salaryProfiles.map(p => p.id === data.id ? { ...data, id: data.id! } : p));
        } else {
            const newProfile: SalaryProfile = {
                ...data,
                id: Date.now(),
            };
            setSalaryProfiles([...salaryProfiles, newProfile]);
        }
        setIsModalOpen(false);
    };

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow border border-slate-200 dark:border-slate-700">
                <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center flex-wrap gap-4">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Salary Profiles</h2>
                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search profiles..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                            />
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon className="h-5 w-5 text-slate-400" />
                            </div>
                        </div>
                        <button onClick={handleAdd} className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                            Add New Salary Profile
                        </button>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500 dark:text-slate-400">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50 dark:bg-slate-700 dark:text-slate-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">Profile Name</th>
                                {days.map(day => (
                                    <th key={day} scope="col" className="px-6 py-3 capitalize">{day}</th>
                                ))}
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProfiles.map(profile => (
                                <tr key={profile.id} className="bg-white dark:bg-slate-800 border-b dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">
                                        {profile.name}
                                    </td>
                                    {days.map(day => (
                                        <td key={day} className="px-6 py-4">
                                            {formatCurrency(profile.rates[day as keyof typeof profile.rates], companyInfo.baseCurrency, displayCurrency)}
                                        </td>
                                    ))}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center space-x-2">
                                            <button onClick={() => handleEdit(profile)} className="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300" title="Edit">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                            <button onClick={() => handleDelete(profile)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300" title="Delete">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProfiles.length === 0 && (
                                <tr>
                                    <td colSpan={9} className="px-6 py-8 text-center text-slate-500 dark:text-slate-400">
                                        No salary profiles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedProfile ? 'Edit Salary Profile' : 'Add New Salary Profile'}>
                <SalaryProfileForm profile={selectedProfile} onSave={handleSave} onClose={() => setIsModalOpen(false)} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete the salary profile "<strong>{profileToDelete?.name}</strong>"? This action cannot be undone.
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

export default SalaryProfiles;
