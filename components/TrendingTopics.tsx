
import React from 'react';

const TRENDING = [
  { id: '1', title: 'The Steam Engine', category: 'Innovation', color: 'from-amber-500/20' },
  { id: '2', title: 'Quantum Mechanics', category: 'Science', color: 'from-blue-500/20' },
  { id: '3', title: 'The Internet', category: 'Technology', color: 'from-purple-500/20' },
  { id: '4', title: 'The Printing Press', category: 'History', color: 'from-green-500/20' },
  { id: '5', title: 'Calculus', category: 'Mathematics', color: 'from-red-500/20' },
  { id: '6', title: 'Antibiotics', category: 'Medicine', color: 'from-cyan-500/20' },
];

interface TrendingTopicsProps {
  onSelect: (topic: string) => void;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ onSelect }) => {
  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-6 text-gray-300 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
        Trending Explorations
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {TRENDING.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.title)}
            className={`group relative p-6 text-left rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500/50 hover:bg-white/[0.08] transition-all overflow-hidden`}
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
            <span className="block text-xs font-bold uppercase tracking-widest text-amber-500/70 mb-1">
              {item.category}
            </span>
            <span className="block text-lg font-bold text-white group-hover:translate-x-1 transition-transform">
              {item.title}
            </span>
            <div className="mt-4 flex items-center text-xs text-gray-500 group-hover:text-amber-400 transition-colors">
              Explore Timeline <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
