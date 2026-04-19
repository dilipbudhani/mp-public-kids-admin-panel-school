import { motion } from 'framer-motion';
import PhotoGrid from '@/components/gallery/PhotoGrid';

export default function LifeAtSchoolPage() {
    return (
        <main className="flex flex-col">
            {/* Hero */}
            <section className="relative h-[400px] flex items-center bg-accent overflow-hidden">
                <div className="container relative z-10 text-white">
                    <div className="max-w-2xl">
                        <h1 className="text-6xl font-serif font-bold mb-4">Life at <span className="text-secondary">Excellence</span></h1>
                        <p className="text-xl text-white/60 leading-relaxed">
                            A vibrant campus culture where curiosity meets opportunity. Explore the moments that define our student experience.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
                        <div className="max-w-xl">
                            <h2 className="text-4xl font-serif text-accent font-bold mb-4">Capturing the Spirit</h2>
                            <div className="w-16 h-1 bg-secondary mb-6" />
                            <p className="text-slate-500">From academic triumphs to sporting glory, witness the multi-faceted life of our students.</p>
                        </div>

                        <div className="flex gap-4">
                            {['All', 'Sports', 'Classroom', 'Events'].map((cat) => (
                                <button key={cat} className="px-6 py-2 rounded-full border border-slate-200 text-sm font-bold hover:bg-secondary hover:border-secondary transition-all">
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <PhotoGrid />
                </div>
            </section>

            {/* Events Feature */}
            <section className="py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="bg-white rounded-[3rem] p-12 lg:p-20 shadow-xl flex flex-col lg:flex-row items-center gap-16">
                        <div className="w-full lg:w-1/2">
                            <span className="text-secondary font-bold text-sm uppercase tracking-widest mb-4 block">Annual Calendar</span>
                            <h2 className="text-4xl font-serif text-accent font-bold mb-8 italic">Traditions & <span className="text-primary italic">Innovation</span></h2>
                            <div className="space-y-8">
                                {[
                                    { date: 'Oct 15', name: 'Annual Sports Day', loc: 'Main Stadium' },
                                    { date: 'Nov 24', name: 'Science & Arts Exhibition', loc: 'Academic Wing' },
                                    { date: 'Jan 12', name: 'Founders Day Gala', loc: 'Auditorium' },
                                ].map((ev, i) => (
                                    <div key={i} className="flex gap-8 group">
                                        <div className="w-20 h-20 bg-primary/5 rounded-2xl flex flex-col items-center justify-center shrink-0 border border-primary/10 transition-colors group-hover:bg-primary group-hover:text-white">
                                            <span className="font-bold">{ev.date.split(' ')[1]}</span>
                                            <span className="text-[10px] uppercase font-bold opacity-50">{ev.date.split(' ')[0]}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-bold text-accent mb-1">{ev.name}</h4>
                                            <p className="text-slate-500 text-sm uppercase tracking-widest flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 bg-secondary rounded-full" /> {ev.loc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="w-full lg:w-1/2 h-[400px] bg-slate-100 rounded-3xl" />
                    </div>
                </div>
            </section>
        </main>
    );
}
