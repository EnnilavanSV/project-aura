import React from 'react';
import API from '../api/axios';
import { useState } from 'react';
import { useEffect } from 'react';

const Dashboard = () => {
    const [prompts, setPrompts] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('General');

    const [copiedId, setCopiedId] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                // No more localhost URLs or manual tokens!
                const response = await API.get('/prompts');
                setPrompts(response.data);
            } catch (error) {
                console.error("Could not fetch prompts:", error);
            }
        };
        fetchPrompts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !content) return;

        try {
            // Just pass the data, the interceptor handles the security!
            const response = await API.post('/prompts', { title, content, category });

            setPrompts([response.data, ...prompts]);
            setTitle('');
            setContent('');
            setCategory('General');
        } catch (error) {
            console.error("Error saving prompt:", error);
        }
    };

    //copy function
    const handleCopy = (id, textToCopy) => {
        navigator.clipboard.writeText(textToCopy); // The magic browser API
        setCopiedId(id); // Trigger the "Copied!" text

        // Reset back to "Copy" after 2 seconds
        setTimeout(() => {
            setCopiedId(null);
        }, 2000);
    };

    //Delete function
    const handleDelete = async (id) => {


        try {
            await API.delete(`/prompts/${id}`); //tells the backend to delete
            setPrompts(prompts.filter((prompt) => prompt._id !== id));

        } catch (error) {
            console.error("Error deleting prompt", error)
        }
    }

    // The Action: Throw away the badge and reload the page
    const handleLogout = () => {
        localStorage.removeItem('aura_token');
        window.location.href = '/login'; //Goes to login page
    };


    const filteredPrompts = prompts.filter((prompt) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            prompt.title.toLowerCase().includes(searchLower) ||
            prompt.content.toLowerCase().includes(searchLower) ||
            prompt.category.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-5xl mx-auto">

                <header className="mb-10 flex justify-between items-center border-b border-gray-700 pb-4">
                    <h1 className="text-4xl font-bold text-indigo-400">Aura Prompt Vault</h1>
                    <button onClick={handleLogout} className="text-gray-400 hover:text-white transition-colors">
                        Logout
                    </button>
                </header>

                {/* THE INPUT FORM */}
                <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-xl shadow-2xl mb-12 border border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 text-indigo-300">Save a New Formula</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <input
                            type="text"
                            placeholder="Prompt Title (e.g., Anime LoRA Settings)"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-indigo-500"
                        />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-gray-900 border border-gray-600 rounded p-3 text-white focus:outline-none focus:border-indigo-500"
                        >
                            <option value="General">General</option>
                            <option value="Image Generation">Image Generation</option>
                            <option value="Video Scripting">Video Scripting</option>
                            <option value="Audio/ASMR">Audio / ASMR</option>
                        </select>
                    </div>
                    <textarea
                        placeholder="Paste your exact prompt parameters, negative prompts, or script formulas here..."
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white h-40 mb-4 focus:outline-none focus:border-indigo-500"
                    />
                    <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 font-bold py-3 rounded transition-colors">
                        Encrypt & Save to Vault
                    </button>
                </form>

                {/* THE SAVED PROMPTS GRID */}
                {/* --- UPDATED SAVED PROMPTS SECTION --- */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <h2 className="text-2xl font-bold text-gray-300">Your Secured Formulas</h2>

                    {/* THE NEW SEARCH BAR */}
                    <div className="w-full md:w-1/3 relative">
                        <input
                            type="text"
                            placeholder="Search vault..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-900 border border-gray-600 rounded-full py-2 px-4 text-white focus:outline-none focus:border-indigo-500 pl-10"
                        />
                        {/* A simple magnifying glass icon */}
                        <span className="absolute left-3 top-2.5 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* WE CHANGED THIS FROM prompts.length TO filteredPrompts.length */}
                    {filteredPrompts.length === 0 ? (
                        <p className="text-gray-500 italic col-span-3">
                            {prompts.length === 0
                                ? "Your vault is currently empty. Save your first prompt above."
                                : "No prompts match your search."}
                        </p>
                    ) : (

                        /* WE CHANGED THIS TO map OVER filteredPrompts */
                        filteredPrompts.map((prompt) => (
                            <div key={prompt._id} className="bg-gray-800 border border-gray-700 p-6 rounded-xl shadow-lg hover:border-indigo-500 transition-colors flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-lg text-indigo-300 line-clamp-1 mr-2">{prompt.title}</h3>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className="text-xs font-bold px-3 py-1 bg-gray-900 text-gray-300 rounded-full border border-gray-700">
                                            {prompt.category}
                                        </span>
                                        <button
                                            onClick={() => handleCopy(prompt._id, prompt.content)}
                                            className={`text-xs font-bold px-3 py-1 rounded transition-colors ${copiedId === prompt._id
                                                ? "bg-green-600 text-white"
                                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                                                }`}
                                        >
                                            {copiedId === prompt._id ? "✓ Copied" : "Copy"}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(prompt._id)}
                                            className="text-xs font-bold px-3 py-1 bg-red-900/40 hover:bg-red-600 text-red-300 hover:text-white rounded border border-red-800/50 hover:border-red-600 transition-colors"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-900 p-3 rounded border border-gray-700 flex-grow overflow-hidden relative">
                                    <p className="text-gray-400 text-sm font-mono whitespace-pre-wrap line-clamp-4">
                                        {prompt.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>


            </div>
        </div>
    );
};



export default Dashboard;