import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';

const AgenticSearch = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);

    // 1. Add your dynamic base URL here
    const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

    const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;
        
        setIsLoading(true);
        setResponse(''); 
        setIsError(false);

        try {
            // 2. Change the hardcoded localhost string to use the dynamic variable
            const res = await axios.post(`${API_BASE_URL}/properties/search/agentic`, {
                query: query
            });
            setResponse(res.data);

        } catch (error) {
            console.error("Error fetching agentic search:", error);
            setIsError(true);
            setResponse("I'm having trouble connecting to the AI property database right now. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 mb-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                    <svg className="w-6 h-6 text-[#C9A24D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h2 className="text-xl font-bold text-gray-800">AI Property Assistant</h2>
                </div>
                
                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)} 
                        placeholder="Describe the property you are looking for (e.g., a pet-friendly 2-bedroom in Sandton under R15000)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A24D] focus:border-transparent transition-shadow text-gray-700 placeholder-gray-400"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit" 
                        disabled={isLoading || !query.trim()}
                        className="bg-[#C9A24D] hover:bg-[#B79424] text-white font-semibold px-8 py-3 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed whitespace-nowrap flex items-center justify-center min-w-[120px]"
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Searching
                            </span>
                        ) : 'Ask AI'}
                    </button>
                </form>

                {response && (
                    <div className={`mt-6 p-5 rounded-xl text-sm md:text-base leading-relaxed whitespace-pre-wrap ${
                        isError ? 'bg-red-50 text-red-700 border border-red-100' : 'bg-gray-50 text-gray-700 border border-gray-100'
                    }`}>
                        {response}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AgenticSearch;