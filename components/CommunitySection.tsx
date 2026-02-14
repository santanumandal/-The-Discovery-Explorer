
import React, { useState } from 'react';
import { CommunityStory } from '../types';

export const CommunitySection: React.FC = () => {
  const [submissions, setSubmissions] = useState<CommunityStory[]>([
    {
      id: '1',
      topic: 'The Evolution of the Telescope',
      author: 'GalileoEnthusiast',
      content: 'Before the telescope, the stars were just distant pinpricks of light, and the heavens were a mystery that only philosophers could guess at. This lack of vision limited our understanding of our place in the cosmos. Then, in 1608, Dutch lens grinders realized that glass could bend light. Galileo turned this to the sky, and suddenly the Moon had craters and Jupiter had moons. Today, we carry this legacy in every camera lens and smartphone, continuing to zoom into the mysteries of our daily lives.',
      references: 'https://nasa.gov',
      status: 'published',
      date: '2024-03-10'
    }
  ]);

  const [form, setForm] = useState({ topic: '', author: '', content: '', references: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API review delay
    setTimeout(() => {
      const newStory: CommunityStory = {
        id: Math.random().toString(36).substr(2, 9),
        ...form,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      setSubmissions([newStory, ...submissions]);
      setIsSubmitting(false);
      setShowSuccess(true);
      setForm({ topic: '', author: '', content: '', references: '' });
      setTimeout(() => setShowSuccess(false), 5000);
    }, 1500);
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
        {/* Left Column: Form */}
        <div className="lg:col-span-1 space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold serif text-white">Tell Your Story</h2>
            <p className="text-gray-400">
              Contribute your own narrative. Try to focus on the human problem, the struggle it caused, and how the discovery changed everything for us.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 bg-white/5 p-8 rounded-3xl border border-white/10 shadow-2xl">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Discovery Topic</label>
              <input 
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                placeholder="e.g. Penicillin"
                value={form.topic}
                onChange={e => setForm({...form, topic: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Your Handle</label>
              <input 
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                placeholder="@historian_jane"
                value={form.author}
                onChange={e => setForm({...form, author: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">The Narrative</label>
              <textarea 
                required
                rows={8}
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 outline-none resize-none transition-all"
                placeholder="What was the problem? How did it feel? How did the discovery fix it? How do we see it today?"
                value={form.content}
                onChange={e => setForm({...form, content: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Evidence/Sources</label>
              <input 
                required
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-amber-500/50 outline-none transition-all"
                placeholder="Reference links..."
                value={form.references}
                onChange={e => setForm({...form, references: e.target.value})}
              />
            </div>
            
            <button 
              disabled={isSubmitting}
              type="submit"
              className="w-full py-4 bg-amber-500 text-black font-bold rounded-xl hover:bg-amber-400 transition-all transform active:scale-[0.98] shadow-lg shadow-amber-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Submitting to Review...' : 'Submit to Archives'}
            </button>

            {showSuccess && (
              <div className="bg-green-500/10 border border-green-500/20 text-green-400 p-4 rounded-xl text-sm animate-in fade-in zoom-in text-center">
                Success! Your story is now being reviewed by our curators.
              </div>
            )}
          </form>
        </div>

        {/* Right Column: Feed */}
        <div className="lg:col-span-2 space-y-12">
          <div className="flex items-center justify-between border-b border-white/10 pb-6">
            <h3 className="text-xl font-bold text-white">Community Library</h3>
            <span className="text-sm text-gray-500">{submissions.length} narratives discovered</span>
          </div>

          <div className="space-y-8">
            {submissions.map(story => (
              <div key={story.id} className="group bg-white/5 border border-white/10 rounded-[2rem] p-8 space-y-4 hover:border-amber-500/30 transition-all hover:bg-white/[0.08] shadow-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <h4 className="text-2xl font-bold text-white group-hover:text-amber-400 transition-colors serif">{story.topic}</h4>
                    <p className="text-sm text-amber-500/80 font-medium">by {story.author}</p>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${story.status === 'published' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                    {story.status}
                  </div>
                </div>
                <div className="relative">
                   <p className="text-gray-400 leading-relaxed line-clamp-4 text-lg">
                     {story.content}
                   </p>
                   <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span className="w-1 h-1 rounded-full bg-gray-500" />
                    {story.date}
                  </div>
                  <button className="px-5 py-2 rounded-full border border-white/10 text-sm font-bold text-gray-300 hover:text-black hover:bg-amber-500 hover:border-amber-500 transition-all">
                    Read Story →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
