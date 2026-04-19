import Image from 'next/image';
import { motion } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';

const faculty = [
    { name: 'Dr. Sarah Johnson', role: 'Principal', qualification: 'Ph.D. in Education, M.Sc. Physics', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' },
    { name: 'Mark Thompson', role: 'HOD Science', qualification: 'M.Sc. Chemistry, B.Ed.', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=400' },
    { name: 'Priya Sharma', role: 'HOD Mathematics', qualification: 'M.A. Mathematics, CTET Qualified', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
    { name: 'Robert Wilson', role: 'Sports Director', qualification: 'M.P.Ed, National Level Coach', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
];

export default function FacultyGrid() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {faculty.map((member, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="group relative"
                >
                    <div className="relative h-[400px] rounded-2xl overflow-hidden mb-4">
                        <Image
                            src={member.image}
                            alt={member.name}
                            fill
                            className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500 scale-105 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-primary/95 via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <div className="absolute bottom-6 left-6 right-6 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex gap-4">
                                <button className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                    <Linkedin size={18} />
                                </button>
                                <button className="w-10 h-10 bg-secondary text-primary rounded-full flex items-center justify-center hover:bg-white transition-colors">
                                    <Mail size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <h4 className="text-xl font-playfair text-primary font-bold mb-1">{member.name}</h4>
                    <p className="text-secondary font-bold text-xs uppercase tracking-widest mb-2">{member.role}</p>
                    <p className="text-slate-500 text-sm italic">{member.qualification}</p>
                </motion.div>
            ))}
        </div>
    );
}
