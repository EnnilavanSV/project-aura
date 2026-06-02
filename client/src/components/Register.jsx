import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import API from '../api/axios';

// 1. The Rules
const registerSchema = z.object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const Register = () => {
    // 2. The Memory
    const [serverMessage, setServerMessage] = useState('');
    const [isError, setIsError] = useState(false);

    // 3. The Engine
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        resolver: zodResolver(registerSchema),
        mode: "onChange"
    });

    // 4. The Action
    const onSubmit = async (data) => {
        try {
            setIsError(false);
            const response = await API.post('/auth/register', data);
            setServerMessage(response.data.message || "Registration Successful!");
            reset();
        } catch (error) {
            setIsError(true);
            setServerMessage(error.response?.data?.message || "Something went wrong.");
        }
    };

    // 5. The Visuals
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
            <div className="max-w-md w-full bg-gray-800 rounded-xl p-8 shadow-2xl border border-gray-700">
                <h2 className="text-3xl font-bold text-center text-white mb-2">Project Aura</h2>
                <p className="text-gray-400 text-center mb-6">Create your developer account</p>

                {serverMessage && (
                    <div className={`p-3 rounded-lg mb-4 text-sm text-center font-medium ${isError ? 'bg-red-900/50 text-red-400 border border-red-800' : 'bg-green-900/50 text-green-400 border border-green-800'}`}>
                        {serverMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
                        <input
                            type="text"
                            {...register('username')}
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="aura_dev"
                        />
                        {errors.username && <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>}
                    </div>

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
                        Sign Up
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;