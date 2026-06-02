import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import API from '../api/axios';

//  The Rules (we don't need a username here!)
const loginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

const Login = () => {
    //  The Memory
    const [serverMessage, setServerMessage] = useState('');
    const [isError, setIsError] = useState(false);

    //  The Engine 
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: zodResolver(loginSchema),
        mode: "onChange"
    });

    //  The Action
    const onSubmit = async (data) => {
        try {
            setIsError(false);

            // Hit the login route instead of register
            const response = await API.post('/auth/login', data);

            // THE NEW MAGIC: The server gave us the VIP badge. Lock it in the browser's safe.
            const token = response.data.token;
            localStorage.setItem('aura_token', token);

            window.location.href = '/dashboard'; //it teleports to that URL

        } catch (error) {
            setIsError(true);
            // We don't want to tell hackers exactly what they got wrong, so keep it vague
            setServerMessage(error.response?.data?.message || "Invalid email or password.");
        }
    };

    // 5. The Visual Layout
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Login</h2>
                <p className="text-gray-400 text-center mb-6">Access your Project Aura dashboard</p>

                {serverMessage && (
                    <div className={`p-3 rounded-lg mb-4 text-sm text-center font-medium ${isError ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-green-900/50 text-green-400 border border-green-800'}`}>
                        {serverMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="you@example.com"
                        />
                        {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                        <input
                            type="password"
                            {...register('password')}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="••••••••"
                        />
                        {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 px-4 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                    >
                        Sign In
                    </button>
                    <p className="text-center text-gray-400 text-sm mt-4">
                        Don't have an account? <Link to="/register" className="text-blue-500 hover:text-blue-400">Register here</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
