import React from 'react';

const ProfileHeader = ({ user }) => {
    return (
        <div className="p-6 md:p-8 flex items-center gap-6">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg ring-4 ring-blue-50">
                {user.name.charAt(0)}
            </div>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">{user.name}</h2>
                <div className="mt-2 flex items-center gap-2 text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span>{user.email}</span>
                </div>
                <div className="mt-2 text-sm text-blue-600 font-medium bg-blue-50 inline-block px-3 py-1 rounded-full">
                    {user.role || 'User'}
                </div>
            </div>
        </div>
    );
};

export default ProfileHeader;
