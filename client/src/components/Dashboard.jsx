import React from 'react';

const Dashboard = () => {
    // The Action: Throw away the badge and reload the page
    const handleLogout = () => {
        localStorage.removeItem('aura_token');
        window.location.href = '/login'; //Goes to login page
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 px-4">
            <div className="max-w-2xl w-full bg-gray-800 rounded-xl p-10 shadow-2xl border border-gray-700 text-center">

                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
                    <span className="text-4xl">🚀</span>
                </div>

                <h2 className="text-4xl font-bold text-white mb-4">Welcome to the VIP Lounge</h2>
                <p className="text-gray-400 text-lg mb-8">
                    You made it! If you are seeing this page, it means your browser successfully presented a valid JWT VIP badge.
                </p>

                <button
                    onClick={handleLogout}
                    className="py-3 px-8 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-red-600/20"
                >
                    Log Out
                </button>
            </div>
        </div>
    );
};

export default Dashboard;