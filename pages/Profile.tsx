import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';

const Profile: React.FC = () => {
    const { user, updateUserProfile, updateUserPassword } = useAppContext();
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [avatar, setAvatar] = useState(user?.avatar || '');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [infoSuccess, setInfoSuccess] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setAvatar(user.avatar);
        }
    }, [user]);

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        updateUserProfile(user.id, { name, email, avatar });
        setInfoSuccess('Profile information updated successfully!');
        setTimeout(() => setInfoSuccess(''), 3000);
    };
    
    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }
        updateUserPassword(user.id, password);
        setPasswordSuccess('Password updated successfully!');
        setPassword('');
        setConfirmPassword('');
        setTimeout(() => setPasswordSuccess(''), 3000);
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                <form onSubmit={handleInfoSubmit} className="space-y-4">
                    <div className="flex items-center space-x-4">
                        <img className="w-20 h-20 rounded-full object-cover" src={avatar} alt="User Avatar" />
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer bg-slate-200 dark:bg-slate-700 px-3 py-2 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600">
                                <span>Change Photo</span>
                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                            </label>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Name</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                            Update Information
                        </button>
                        {infoSuccess && <p className="text-sm text-green-600 dark:text-green-400">{infoSuccess}</p>}
                    </div>
                </form>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-xl font-semibold mb-4">Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password"
                               className="block text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword"
                               className="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                            required
                        />
                    </div>
                    <div className="flex items-center space-x-4">
                        <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                            Change Password
                        </button>
                        {passwordSuccess && <p className="text-sm text-green-600 dark:text-green-400">{passwordSuccess}</p>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Profile;