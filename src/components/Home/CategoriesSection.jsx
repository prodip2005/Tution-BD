import React from 'react';
import { motion } from 'framer-motion';

const categories = [
    { name: 'Mathematics', count: '450+ Tutors', color: 'bg-primary' },
    { name: 'English', count: '300+ Tutors', color: 'bg-secondary' },
    { name: 'Science', count: '280+ Tutors', color: 'bg-accent' },
    { name: 'Programming', count: '150+ Tutors', color: 'bg-primary' },
    { name: 'Physics', count: '200+ Tutors', color: 'bg-secondary' },
    { name: 'Chemistry', count: '180+ Tutors', color: 'bg-accent' },
    { name: 'Biology', count: '220+ Tutors', color: 'bg-primary' },
    { name: 'History', count: '100+ Tutors', color: 'bg-secondary' },
];

const CategoriesSection = () => {
    return (
        <div className="py-20  bg-transparent">
            <div className="max-w-7xl  mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-black mb-4 uppercase italic tracking-tighter text-base-content">Popular <span className="text-primary text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Categories</span></h2>
                    <p className="text-base-content/60 max-w-2xl mx-auto font-bold uppercase tracking-widest text-xs">Find expert tutors in every subject you need.</p>
                </div>

                <div className="grid grid-cols-2  md:grid-cols-4 gap-6">
                    {categories.map((cat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            className="p-6 rounded-3xl bg-base-200 dark:bg-white/5 backdrop-blur-md border border-base-300 dark:border-white/5 cursor-pointer group hover:bg-base-300 dark:hover:bg-white/10 transition-all font-bold"
                        >
                            <div className={`w-3 h-3 ${cat.color} rounded-full mb-4 group-hover:scale-150 transition-transform shadow-[0_0_10px_currentColor]`}></div>
                            <h3 className="text-lg font-black mb-1 text-base-content uppercase tracking-tight">{cat.name}</h3>
                            <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-widest">{cat.count}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSection;
