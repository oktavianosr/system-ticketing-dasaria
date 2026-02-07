import React from 'react';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileForm from '../components/profile/ProfileForm';
import PasswordForm from '../components/profile/PasswordForm';
import { useAuth } from '../hooks/useAuth';
import LoadingSpinner from '../components/shared/LoadingSpinner';

interface User {
    name: string;
    email: string;
    phone?: string;
    role?: string;
}

const ProfilePage: React.FC = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="bg-gray-500 min-h-screen flex items-center justify-center">
                <LoadingSpinner />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="bg-gray-50 min-h-screen p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <ProfileHeader user={user} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
                            <p className="text-sm text-gray-500 mt-1">Update your personal details here.</p>
                        </div>
                        <ProfileForm user={user} />
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="mb-6 border-b border-gray-100 pb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
                            <p className="text-sm text-gray-500 mt-1">Manage your password and security settings.</p>
                        </div>
                        <PasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
