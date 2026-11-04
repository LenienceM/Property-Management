import React, { useState } from 'react';
import axios from 'axios';

const AgenticSearch = () => {
    const [query, setQuery] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setResponse(''); // Clear previous results

        try {
            const res = await axios.post('http://localhost:8080/api/properties/search/agentic', {
                query: query
            });
            // The backend returns a plain string from the LLM
            setResponse(res.data);
        } catch (error) {
            console.error("Error fetching agentic search:", error);
            setResponse("I'm having trouble connecting to the property database right now.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-4">AI Property Assistant</h2>
            
            <form onSubmit={handleSearch} className="flex gap-2 mb-6">
                <input 
                    type="text" 
                    value={query} 
                    onChange={(e) => setQuery(e.target.value)} 
                    placeholder="e.g. Find me a pet-friendly flat in Sandton under R8000"
                    className="flex-1 p-2 border rounded"
                    disabled={isLoading}
                />
                <button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {isLoading ? 'Searching...' : 'Ask AI'}
                </button>
            </form>

            {isLoading && (
                <div className="text-gray-500 italic">
                    Analyzing criteria and searching database... (This may take a few seconds)
                </div>
            )}

            {response && (
                <div className="bg-gray-50 p-4 rounded border whitespace-pre-wrap">
                    {response}
                </div>
            )}
        </div>
    );
};

export default AgenticSearch;