import { useState } from 'react';

const videos = [
    { id: '1', title: '15 Min HIIT Cardio', category: 'hiit', url: 'https://www.youtube.com/embed/ml6cT4AZdqI' },
    { id: '2', title: 'Strength Training at Home', category: 'strength', url: 'https://www.youtube.com/embed/U0bhE67HuDY' },
    { id: '3', title: 'Morning Yoga Stretch', category: 'yoga', url: 'https://www.youtube.com/embed/Eml2xnoLpYE' },
    { id: '4', title: 'Core Workout Routine', category: 'strength', url: 'https://www.youtube.com/embed/dJlFmxiL11s' },
];

const VideoLibrary = () => {
    const [filter, setFilter] = useState('all');

    const filtered = filter === 'all' ? videos : videos.filter(v => v.category === filter);

    return (
        <div className="w-full">
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'hiit', 'strength', 'yoga'].map((cat) => (
                    <button 
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap capitalize border ${
                            filter === cat ? 'bg-electricCyan text-black border-electricCyan' : 'bg-black/5 dark:bg-white/5 text-textMain border-black/10 dark:border-white/10 hover:border-white/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(video => (
                    <div key={video.id} className="glass-card overflow-hidden">
                        <div className="aspect-video">
                            <iframe 
                                className="w-full h-full"
                                src={video.url} 
                                title={video.title} 
                                frameBorder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowFullScreen
                            ></iframe>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-textMain mb-1">{video.title}</h3>
                            <span className="text-xs text-electricCyan uppercase tracking-widest">{video.category}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VideoLibrary;
