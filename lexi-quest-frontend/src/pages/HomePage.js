import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

function HomePage({ user, likedWords, updateLikedWords }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const wordOfTheDay = {
        word: 'Serendipity',
        phonetic: '/ˌser.ənˈdɪp.ɪ.ti/',
        definition: 'The occurrence and development of events by chance in a happy or beneficial way.',
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query.trim()) {
            setError('Please enter a word to search.');
            return;
        }
        
        setIsLoading(true);
        setError('');
        setResults(null);

        try {
            const response = await fetch(`${API_URL}/api/search/${encodeURIComponent(query.trim())}`);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            
            setResults(data);
            setQuery('');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 md:p-8">
            {/* Hero Section */}
            <div className="max-w-4xl mx-auto text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    Find Your Word
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg max-w-2xl mx-auto">
                    The ultimate dictionary for curious minds and ambitious learners. Discover, learn, and expand your vocabulary.
                </p>
                
                {/* Search Form */}
                <form onSubmit={handleSearch} className="flex items-center max-w-2xl mx-auto mb-8">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Enter a word to search..."
                        className="w-full px-5 py-4 text-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-l-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition shadow-sm"
                    />
                    <button
                        type="submit"
                        className="bg-indigo-600 text-white px-6 py-4 rounded-r-md hover:bg-indigo-700 disabled:bg-indigo-400 transition shadow-sm"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        )}
                    </button>
                </form>
            </div>

            {/* Main Content Area */}
            <div className="max-w-4xl mx-auto">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
                        <div className="flex items-center">
                            <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {results && !isLoading && (
                    <Definition results={results} />
                )}

                {!results && !isLoading && !error && (
                    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
                        <div className="flex items-center mb-4">
                            <div className="text-2xl mr-2">⭐</div>
                            <h3 className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 uppercase">Word of the day</h3>
                        </div>
                        <h4 className="text-3xl font-bold mb-2 text-gray-900 dark:text-gray-100">{wordOfTheDay.word}</h4>
                        <p className="text-gray-500 dark:text-gray-400 mb-4">{wordOfTheDay.phonetic}</p>
                        <p className="text-lg text-gray-700 dark:text-gray-300">{wordOfTheDay.definition}</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Definition component to display search results
function Definition({ results }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in transition-colors duration-200">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900 dark:to-purple-900 p-8 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                    {results.word}
                </h2>
                {results.phonetic && (
                    <p className="text-xl text-indigo-600 dark:text-indigo-400">{results.phonetic}</p>
                )}
            </div>

            <div className="p-8 space-y-8">
                {results.meanings?.map((meaning, index) => (
                    <div key={index}>
                        <div className="flex items-center mb-6">
                            <h3 className="text-2xl font-semibold italic text-indigo-600 dark:text-indigo-400">
                                {meaning.partOfSpeech}
                            </h3>
                            <div className="h-px bg-gray-200 dark:bg-gray-600 flex-grow ml-4"></div>
                        </div>

                        <div className="space-y-6">
                            {meaning.definitions?.map((def, defIndex) => (
                                <div key={defIndex} className="pl-4 border-l-2 border-gray-100 dark:border-gray-600">
                                    <p className="text-lg text-gray-800 dark:text-gray-200 mb-2">{def.definition}</p>
                                    {def.example && (
                                        <p className='text-gray-600 dark:text-gray-400 italic mb-3'>
                                            <span className="font-medium">Example:</span> "{def.example}"
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default HomePage;