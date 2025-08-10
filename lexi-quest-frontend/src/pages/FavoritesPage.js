import React from 'react';

function FavoritesPage({ user, likedWords, updateLikedWords, setPage }) {
    if (!user) {
        return (
            <div className="container mx-auto p-4 md:p-8 max-w-2xl">
                <div className="text-center">
                    <div className="text-6xl mb-4">❤️</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Your Favorite Words</h1>
                    <p className="text-gray-600 mb-4">Please log in to view your favorite words.</p>
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
            <div className="text-center mb-8">
                <div className="text-6xl mb-4">❤️</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Your Favorite Words</h1>
                <p className="text-gray-600">
                    {likedWords?.length === 0 
                        ? "You haven't added any favorite words yet." 
                        : `You have ${likedWords?.length || 0} favorite word${likedWords?.length !== 1 ? 's' : ''}.`
                    }
                </p>
            </div>

            {likedWords?.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-4xl mb-4">📚</div>
                    <p className="text-gray-600 mb-6">
                        Start building your vocabulary by searching for words and adding them to your favorites!
                    </p>
                    <button
                        onClick={() => setPage('home')}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700 transition-colors"
                    >
                        Start Exploring Words
                    </button>
                </div>
            )}
        </div>
    );
}

export default FavoritesPage;