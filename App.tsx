
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { TrendingTopics } from './components/TrendingTopics';
import { StoryView } from './components/StoryView';
import { CommunitySection } from './components/CommunitySection';
import { AppState, StoryData } from './types';
import { fetchStory } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.HOME);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeStory, setActiveStory] = useState<StoryData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setError(null);
    setAppState(AppState.LOADING);
    try {
      const data = await fetchStory(query);
      setActiveStory(data);
      setAppState(AppState.STORY);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError("Failed to uncover the scrolls of history. Please try another topic.");
      setAppState(AppState.HOME);
    }
  };

  const handleHomeClick = () => {
    setAppState(AppState.HOME);
    setActiveStory(null);
    setError(null);
  };

  const handleCommunityClick = () => {
    setAppState(AppState.COMMUNITY);
    setActiveStory(null);
    setError(null);
  };

  return (
    <Layout 
      onHomeClick={handleHomeClick} 
      onCommunityClick={handleCommunityClick}
      activeState={appState}
    >
      {appState === AppState.HOME && (
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="max-w-3xl mx-auto text-center space-y-12 mb-24">
            <div className="space-y-4">
              <h2 className="text-amber-500 font-bold tracking-[0.4em] uppercase text-xs">A Journey Through Time</h2>
              <h1 className="text-5xl md:text-7xl font-black tracking-tight text-white serif leading-[1.1]">
                Unravel the Story of <br />
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent">Every Discovery.</span>
              </h1>
              <p className="text-xl text-gray-400 font-light max-w-xl mx-auto">
                Explore the past, present, and future of human ingenuity in a single, immersive narrative.
              </p>
            </div>

            <div className="relative group max-w-2xl mx-auto">
              <input
                type="text"
                placeholder="Search for a topic (e.g., 'Relativity', 'The Camera', 'Zero')"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-6 text-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all group-hover:bg-white/[0.07]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(searchQuery)}
              />
              <button 
                onClick={() => handleSearch(searchQuery)}
                className="absolute right-3 top-3 bottom-3 px-8 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-xl transition-colors"
              >
                Explore
              </button>
            </div>

            {error && (
              <p className="text-red-400 font-medium animate-pulse">{error}</p>
            )}
          </div>

          <div className="max-w-5xl mx-auto">
            <TrendingTopics onSelect={handleSearch} />
          </div>
        </div>
      )}

      {appState === AppState.LOADING && (
        <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
          <div className="relative w-32 h-32 mb-8">
            <div className="absolute inset-0 border-4 border-amber-500/10 rounded-full" />
            <div className="absolute inset-0 border-4 border-t-amber-500 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-amber-500 rounded-lg flex items-center justify-center font-bold text-black text-3xl animate-pulse">
                C
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold serif text-white mb-4 animate-pulse">Consulting the Archives...</h2>
          <p className="text-gray-400 max-w-sm">Tracing the lineage of human innovation through the corridors of time.</p>
          <div className="mt-8 flex gap-2">
             {[0, 1, 2].map(i => (
               <div key={i} className="w-2 h-2 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: `${i * 0.2}s` }} />
             ))}
          </div>
        </div>
      )}

      {appState === AppState.STORY && activeStory && (
        <StoryView data={activeStory} onBack={handleHomeClick} />
      )}

      {appState === AppState.COMMUNITY && (
        <CommunitySection />
      )}
    </Layout>
  );
};

export default App;
