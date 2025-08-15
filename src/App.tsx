import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Ideation from './pages/Ideation';
import Strategy from './pages/Strategy';
import Library from './pages/Library';
import Analytics from './pages/Analytics';
import Collaboration from './pages/Collaboration';
import SocialAccounts from './pages/SocialAccounts';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import Success from './pages/Success';
import AuthCallback from './pages/AuthCallback';

function App() {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <div className="min-h-screen bg-cream">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/success" element={<Success />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              
              {/* Protected routes */}
              <Route path="/*" element={
                <ProtectedRoute>
                  <Navigation />
                  <main className="transition-all duration-300 ease-in-out">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/calendar" element={<Calendar />} />
                      <Route path="/ideation" element={<Ideation />} />
                      <Route path="/strategy" element={<Strategy />} />
                      <Route path="/library" element={<Library />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/collaboration" element={<Collaboration />} />
                      <Route path="/social-accounts" element={<SocialAccounts />} />
                    </Routes>
                  </main>
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </Router>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
