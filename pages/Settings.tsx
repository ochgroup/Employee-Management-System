import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Currency } from '../types';
import { availableCurrencies, currencies } from '../utils/currency';

const Settings: React.FC = () => {
    const { companyInfo, updateCompanyInfo, displayCurrency, setDisplayCurrency } = useAppContext();
    const [name, setName] = useState(companyInfo.name);
    const [address, setAddress] = useState(companyInfo.address);
    const [logo, setLogo] = useState(companyInfo.logo);
    const [baseCurrency, setBaseCurrency] = useState<Currency>(companyInfo.baseCurrency);
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setName(companyInfo.name);
        setAddress(companyInfo.address);
        setLogo(companyInfo.logo);
        setBaseCurrency(companyInfo.baseCurrency);
    }, [companyInfo]);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogo(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateCompanyInfo({ name, address, logo, baseCurrency });
        setSuccess('Company information updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
    };

    const inputClass = "mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-6">Company Settings</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Logo</label>
                        <div className="mt-2 flex items-center space-x-4">
                            <img className="w-20 h-20 rounded-md object-contain bg-slate-100 dark:bg-slate-700 p-1" src={logo} alt="Company Logo" />
                            <div>
                                <label className="cursor-pointer bg-slate-200 dark:bg-slate-700 px-3 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 text-sm font-medium text-slate-700 dark:text-slate-300">
                                    <span>Change Logo</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
                                </label>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="address" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Company Address</label>
                        <input
                            type="text"
                            id="address"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={inputClass}
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="baseCurrency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Base Currency</label>
                        <select
                            id="baseCurrency"
                            value={baseCurrency}
                            onChange={(e) => setBaseCurrency(e.target.value as Currency)}
                            className={inputClass}
                            required
                        >
                            {availableCurrencies.map(code => (
                                <option key={code} value={code}>{currencies[code].name} ({code})</option>
                            ))}
                        </select>
                         <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">All salary and payroll data must be entered in this currency.</p>
                    </div>
                    <div>
                        <label htmlFor="displayCurrency" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Display Currency</label>
                        <select
                            id="displayCurrency"
                            value={displayCurrency}
                            onChange={(e) => setDisplayCurrency(e.target.value as Currency)}
                            className={inputClass}
                            required
                        >
                            {availableCurrencies.map(code => (
                                <option key={code} value={code}>{currencies[code].name} ({code})</option>
                            ))}
                        </select>
                         <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Choose the currency for displaying monetary values throughout the application.</p>
                    </div>
                    <div className="flex items-center space-x-4 pt-2">
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                            Save Changes
                        </button>
                        {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;