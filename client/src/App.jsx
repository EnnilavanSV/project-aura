import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register'
import Dashboard from './components/Dashboard';

function App() {

  const hasToken = localStorage.getItem('aura_token');


  return (
    <BrowserRouter>
      <Routes>
        {/* 1. The Default Route: Send them to Dashboard if logged in, otherwise Login */}
        <Route path="/" element={hasToken ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />

        {/* 2. Public Routes: If they are already logged in, they shouldn't see these */}
        <Route path="/login" element={hasToken ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={hasToken ? <Navigate to="/dashboard" /> : <Register />} />

        {/* 3. Protected Route: Only accessible if they have a badge */}
        <Route path="/dashboard" element={hasToken ? <Dashboard /> : <Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;