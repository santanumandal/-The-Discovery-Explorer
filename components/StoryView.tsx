
import React, { useState, useEffect, useRef } from 'react';
import { StoryData, Milestone } from '../types';
import { generateThematicImage } from '../services/geminiService';

interface ImageSectionProps {
  prompt: string;
  alt: string;
}

const ImageSection: React.FC<ImageSectionProps> = ({ prompt, alt }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const fetchImg = async () => {
      const url = await generateThematicImage(prompt);
      if (active) {
        setImageUrl(url);
        setLoading(false);
      }
    };
    fetchImg();
    return () => { active = false; };
  }, [prompt]);

  return (
    <div className="relative aspect-video rounded-3xl overflow-hidden bg-white/5 border border-white/10 shadow-2xl group cursor-pointer">
      {loading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-amber-500/20 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <img 
            src={imageUrl} 
            alt={alt} 
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <span className="px-4 py-2 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold tracking-widest uppercase border border-white/20">View Detail</span>
          </div>
        </>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export const StoryView: React.FC<{ data: StoryData; onBack: () => void }> = ({ data, onBack }) => {
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number | null>(null);
  const milestoneRefs = useRef<(HTMLDivElement | null)[]>([]);

  const scrollToMilestone = (index: number) => {
    milestoneRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setActiveMilestoneIndex(index);
  };

  return (
    <div className="relative">
      {/* Sticky Interactive Navigation Timeline (Desktop) */}
      <div className="hidden lg:block fixed left-12 top-1/2 -translate-y-1/2 z-40 space-y-4">
        <div className="w-[1px] h-32 bg-gradient-to-t from-amber-500/50 to-transparent mx-auto" />
        {data.milestones.map((m, i) => (
          <button
            key={i}
            onClick={() => scrollToMilestone(i)}
            className="group relative flex items-center justify-center"
          >
            <div className={`w-3 h-3 rounded-full border-2 transition-all ${activeMilestoneIndex === i ? 'bg-amber-500 border-amber-500 scale-150' : 'border-white/20 hover:border-amber-500/50'}`} />
            <div className="absolute left-6 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/80 backdrop-blur-md px-3 py-1 rounded-lg border border-white/10 text-xs text-amber-500 font-bold uppercase tracking-widest">
              {m.year}
            </div>
          </button>
        ))}
        <div className="w-[1px] h-32 bg-gradient-to-b from-amber-500/50 to-transparent mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 space-y-24 pb-32">
        {/* Hero Section */}
        <section className="text-center space-y-6">
          <button 
            onClick={onBack}
            className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors flex items-center gap-2 mx-auto mb-8 bg-white/5 rounded-full"
          >
            ← Return to Explorer
          </button>
          <h1 className="text-6xl md:text-8xl font-black serif bg-gradient-to-b from-white to-gray-600 bg-clip-text text-transparent leading-tight">
            {data.topic}
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 font-light max-w-2xl mx-auto leading-relaxed italic border-x border-amber-500/20 px-8 py-4">
            "{data.summary}"
          </p>
        </section>

        {/* Origin Section */}
        <section className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="flex items-center gap-4 text-amber-500">
            <div className="h-[1px] flex-1 bg-amber-500/20" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">The Ancient Spark</span>
            <div className="h-[1px] flex-1 bg-amber-500/20" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold serif text-white">{data.origin.period}</h2>
              <div className="prose prose-invert prose-amber max-w-none">
                <p className="text-lg text-gray-300 leading-relaxed first-letter:text-5xl first-letter:font-black first-letter:text-amber-500 first-letter:mr-3 first-letter:float-left">
                  {data.origin.description}
                </p>
              </div>
            </div>
            <ImageSection prompt={data.origin.imagePrompt} alt="Discovery Origin" />
          </div>
        </section>

        {/* Evolution Timeline */}
        <section className="space-y-12">
          <div className="flex items-center gap-4 text-blue-500">
            <div className="h-[1px] flex-1 bg-blue-500/20" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">The Turning Points</span>
            <div className="h-[1px] flex-1 bg-blue-500/20" />
          </div>
          
          <div className="relative border-l-2 border-white/5 ml-4 pl-12 space-y-24 py-4">
            {data.milestones.map((milestone, idx) => (
              <div 
                key={idx} 
                ref={(el) => { milestoneRefs.current[idx] = el; }}
                className={`relative transition-all duration-500 ${activeMilestoneIndex === idx ? 'opacity-100 scale-100' : 'opacity-80 scale-[0.98]'}`}
                onMouseEnter={() => setActiveMilestoneIndex(idx)}
              >
                <div className={`absolute -left-[58px] top-0 w-4 h-4 rounded-full border-4 border-black transition-colors duration-500 ${activeMilestoneIndex === idx ? 'bg-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.6)]' : 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]'}`} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-white/[0.02] p-8 rounded-[2rem] border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                  <div className="space-y-4 order-2 md:order-1">
                    <span className="text-3xl font-black text-blue-500 mb-2 block tracking-tighter serif">{milestone.year}</span>
                    <h3 className="text-2xl font-bold text-white">{milestone.event}</h3>
                    <p className="text-gray-400 leading-relaxed text-lg">
                      {milestone.impact}
                    </p>
                    <div className="pt-4 flex items-center gap-3">
                       <span className="w-8 h-[1px] bg-amber-500/50" />
                       <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">Milestone Breakthrough</span>
                    </div>
                  </div>
                  <div className="order-1 md:order-2">
                    <ImageSection prompt={milestone.imagePrompt} alt={milestone.event} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Current State */}
        <section className="space-y-8">
          <div className="flex items-center gap-4 text-green-500">
            <div className="h-[1px] flex-1 bg-green-500/20" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Our World Today</span>
            <div className="h-[1px] flex-1 bg-green-500/20" />
          </div>
          <div className="bg-gradient-to-br from-white/[0.05] to-transparent rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-inner">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
               <ImageSection prompt={data.currentForm.imagePrompt} alt="Current State" />
               <div className="space-y-6">
                  <h2 className="text-4xl font-bold serif text-white">{data.currentForm.status}</h2>
                  <p className="text-xl text-gray-300 leading-relaxed font-light">
                    {data.currentForm.description}
                  </p>
                  <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl">
                     <p className="text-sm text-amber-200 font-medium">
                        💡 Today, this discovery is so ingrained in our lives that we often forget the struggle it once solved.
                     </p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* Future */}
        <section className="space-y-8 relative py-20">
          <div className="absolute inset-0 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="flex items-center gap-4 text-purple-500">
            <div className="h-[1px] flex-1 bg-purple-500/20" />
            <span className="text-xs font-bold uppercase tracking-[0.3em]">Tomorrow's Story</span>
            <div className="h-[1px] flex-1 bg-purple-500/20" />
          </div>
          <div className="text-center space-y-12 relative z-10">
            <div className="max-w-2xl mx-auto space-y-6">
               <h2 className="text-5xl font-bold serif text-white leading-tight">{data.futureNarrative.speculation}</h2>
               <p className="text-2xl text-gray-400 italic font-light leading-relaxed">
                 "{data.futureNarrative.vision}"
               </p>
            </div>
            <ImageSection prompt={data.futureNarrative.imagePrompt} alt="Future Vision" />
          </div>
        </section>

        {/* Grounding References */}
        <section className="pt-20 border-t border-white/10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-6 flex items-center gap-2">
            Verified Knowledge Sources
          </h3>
          <div className="flex flex-wrap gap-3">
            {data.references.map((ref, i) => (
              <a 
                key={i} 
                href={ref.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:border-amber-500/50 hover:text-white transition-all flex items-center gap-2 group shadow-sm"
              >
                <span className="font-medium">{ref.title}</span>
                <span className="opacity-40 group-hover:opacity-100 transition-opacity">↗</span>
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
