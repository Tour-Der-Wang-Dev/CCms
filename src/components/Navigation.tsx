import React from 'react';
import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Lightbulb, 
  Target, 
  FolderOpen, 
  BarChart3, 
  Users, 
  Home,
  PenTool,
  Link,
  LogOut,
  User,
  Settings
} from 'lucide-react';
import SubscriptionStatus from './subscription/SubscriptionStatus';

const Navigation = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, signOut } = useAuth();

  const navItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/calendar', icon: Calendar, label: 'Calendar' },
    { path: '/ideation', icon: Lightbulb, label: 'Ideation' },
    { path: '/strategy', icon: Target, label: 'Strategy' },
    { path: '/library', icon: FolderOpen, label: 'Library' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/collaboration', icon: Users, label: 'Team' },
    { path: '/social-accounts', icon: Link, label: 'Social' },
  ];

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-neutral-200/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-sage rounded-xl flex items-center justify-center">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-semibold text-neutral-800">ContentFlow</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <div className="flex space-x-1 mr-4">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 px-3 lg:px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250 ${
                      isActive
                        ? 'bg-sage text-white shadow-sm'
                        : 'text-neutral-600 hover:text-sage hover:bg-sage/5'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{label}</span>
                </NavLink>
              ))}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:text-sage hover:bg-sage/5 transition-all duration-250"
              >
                <User className="w-4 h-4" />
                <span className="hidden lg:inline">{user?.email?.split('@')[0]}</span>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-medium border border-neutral-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <p className="text-sm font-medium text-neutral-900">{user?.email}</p>
                  </div>
                  
                  <div className="px-4 py-3">
                    <SubscriptionStatus />
                  </div>

                  <div className="border-t border-neutral-100">
                    <NavLink
                      to="/pricing"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-200"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Manage Subscription</span>
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-neutral-600 hover:text-sage hover:bg-sage/5 transition-all duration-250"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200/50 bg-white/95 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium transition-all duration-250 ${
                      isActive
                        ? 'bg-sage text-white shadow-sm'
                        : 'text-neutral-600 hover:text-sage hover:bg-sage/5'
                    }`
                  }
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </NavLink>
              ))}
              
              <div className="border-t border-neutral-200/50 pt-3 mt-3">
                <div className="px-3 mb-3">
                  <SubscriptionStatus />
                </div>
                <NavLink
                  to="/pricing"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium text-neutral-600 hover:text-sage hover:bg-sage/5 transition-all duration-250"
                >
                  <Settings className="w-5 h-5" />
                  <span>Manage Subscription</span>
                </NavLink>
                <button
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-250"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
    </nav>
  );
};

export default Navigation;