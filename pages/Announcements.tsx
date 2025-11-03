import React, { useState, useEffect } from 'react';
import { useAppContext } from '../App';
import { Announcement } from '../types';
import { Role } from '../types';
import Modal from '../components/Modal';

// Form for editing from the modal
const AnnouncementEditForm: React.FC<{
    announcement: Announcement | null;
    onSave: (data: { title: string; content: string }) => void;
    onClose: () => void;
}> = ({ announcement, onSave, onClose }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    useEffect(() => {
        if (announcement) {
            setTitle(announcement.title);
            setContent(announcement.content);
        }
    }, [announcement]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ title, content });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Content</label>
                <textarea
                    id="content"
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    required
                />
            </div>
            <div className="flex justify-end space-x-2 pt-4">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300 dark:bg-slate-600 dark:text-slate-200 dark:hover:bg-slate-500">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Save Changes</button>
            </div>
        </form>
    );
};

// Form for posting a new announcement (inline)
const AnnouncementPostForm: React.FC<{ onPost: (data: { title: string; content: string }) => void }> = ({ onPost }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim() || !content.trim()) return;
        onPost({ title, content });
        setTitle('');
        setContent('');
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Post a New Announcement</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="post-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                    <input
                        type="text"
                        id="post-title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="post-content" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Content</label>
                    <textarea
                        id="post-content"
                        rows={4}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                        required
                    />
                </div>
                <div className="flex justify-start">
                    <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                        Post Announcement
                    </button>
                </div>
            </form>
        </div>
    );
};


const Announcements: React.FC = () => {
    const { announcements, setAnnouncements, user } = useAppContext();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

    const handleEdit = (announcement: Announcement) => {
        setSelectedAnnouncement(announcement);
        setIsEditModalOpen(true);
    };

    const handleDelete = (announcement: Announcement) => {
        setAnnouncementToDelete(announcement);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (announcementToDelete) {
            setAnnouncements(announcements.filter(ann => ann.id !== announcementToDelete.id));
            setIsDeleteModalOpen(false);
            setAnnouncementToDelete(null);
        }
    };

    const handlePost = (formData: { title: string; content: string }) => {
        const newAnnouncement: Announcement = {
            id: Date.now(),
            ...formData,
            date: new Date().toISOString().split('T')[0],
        };
        setAnnouncements([newAnnouncement, ...announcements]);
    };
    
    const handleEditSave = (formData: { title: string; content: string }) => {
        if (selectedAnnouncement) {
            setAnnouncements(announcements.map(ann =>
                ann.id === selectedAnnouncement.id ? { ...ann, ...formData, date: ann.date } : ann
            ));
        }
        setIsEditModalOpen(false);
    };

    return (
        <>
            <div className="space-y-6">
                 {user?.role === Role.Admin && (
                   <AnnouncementPostForm onPost={handlePost} />
                )}

                {announcements.length > 0 ? announcements.map((announcement: Announcement) => (
                    <div key={announcement.id} className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 relative border border-slate-200 dark:border-slate-700">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400">{announcement.title}</h3>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Posted on {announcement.date}</p>
                            </div>
                            {user?.role === Role.Admin && (
                                <div className="flex items-center space-x-4 flex-shrink-0">
                                    <button onClick={() => handleEdit(announcement)} className="font-medium text-sm text-blue-600 hover:underline" title="Edit">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(announcement)} className="font-medium text-sm text-red-600 hover:underline" title="Delete">
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="mt-4 text-slate-600 dark:text-slate-300">{announcement.content}</p>
                    </div>
                )) : (
                    <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 border border-slate-200 dark:border-slate-700">
                        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No announcements yet.</p>
                    </div>
                )}
            </div>

            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Announcement">
                <AnnouncementEditForm announcement={selectedAnnouncement} onSave={handleEditSave} onClose={() => setIsEditModalOpen(false)} />
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion">
                <div className="text-slate-900 dark:text-white">
                    <p className="mb-4">
                        Are you sure you want to delete the announcement "<strong>{announcementToDelete?.title}</strong>"? This action cannot be undone.
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

export default Announcements;