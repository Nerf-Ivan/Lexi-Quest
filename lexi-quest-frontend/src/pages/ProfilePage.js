import React from 'react';

function ProfilePage({ user, setUser, setPage }) {
    if (!user) {
        return (
            <div className="container mx-auto p-4 md:p-8 max-w-2xl">
                <div className="text-center">
                    <p className="text-gray-600 mb-4">Please log in to view your profile.</p>
                    <button
                        onClick={() => setPage('login')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-2xl">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Email</label>
                        <p className="text-gray-800">{user.email}</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-500">Name</label>
                        <p className="text-gray-800">{user.firstName || 'Not set'} {user.lastName || ''}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProfilePage;