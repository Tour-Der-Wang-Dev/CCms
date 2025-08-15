import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Navigation from './components/Navigation';
import { DebugEnv } from './debug-env';

// Lazy load pages to reduce initial bundle size
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Calendar = React.lazy(() => import('./pages/Calendar'));
const Ideation = React.lazy(() => import('./pages/Ideation'));
const Strategy = React.lazy(() => import('./pages/Strategy'));
const Library = React.lazy(() => import('./pages/Library'));
const Analytics = React.lazy(() => import('./pages/Analytics'));
const Collaboration = React.lazy(() => import('./pages/Collaboration'));
const SocialAccounts = React.lazy(() => import('./pages/SocialAccounts'));
const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const Pricing = React.lazy(() => import('./pages/Pricing'));
const Success = React.lazy(() => import('./pages/Success'));
const AuthCallback = React.lazy(() => import('./pages/AuthCallback'));

// Loading component for suspense fallback
const PageLoader = () => (
  <div className="min-h-screen bg-cream flex items-center justify-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage"></div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <DndProvider backend={HTML5Backend}>
        <Router>
          <div className="min-h-screen bg-cream">
            <DebugEnv />
            <Suspense fallback={<PageLoader />}>
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
                      <Suspense fallback={<PageLoader />}>
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
                      </Suspense>
                    </main>
                  </ProtectedRoute>
                } />
              </Routes>
            </Suspense>
          </div>
        </Router>
      </DndProvider>
    </AuthProvider>
  );
}

export default App;
