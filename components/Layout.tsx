
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHomeClick?: () => void;
  onCommunityClick?: () => void;
  activeState?: string;
}

export const Layout: React.FC<LayoutProps> = ({ children, onHomeClick, onCommunityClick, activeState }) => {
  return (
    <div className="min-h-screen flex flex-col selection:bg-amber-500/30">
      <header className="fixed top-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={onHomeClick}
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-600 rounded-lg flex items-center justify-center font-bold text-black text-xl shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform">
              C
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              CHRONOS
            </span>
          </button>
          
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <button 
              onClick={onHomeClick} 
              className={`${activeState !== 'COMMUNITY' ? 'text-amber-400' : 'text-gray-400'} hover:text-amber-400 transition-colors`}
            >
              Explorer
            </button>
            <button 
              onClick={onCommunityClick} 
              className={`${activeState === 'COMMUNITY' ? 'text-amber-400' : 'text-gray-400'} hover:text-amber-400 transition-colors`}
            >
              Community
            </button>
            <a href="#" className="text-gray-400 hover:text-amber-400 transition-colors">Archive</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1 pt-16">
        {children}
      </main>

      <footer className="py-8 bg-black border-t border-white/5 text-center text-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Chronos - Unlocking the Story of Discovery</p>
      </footer>
    </div>
  );
};
