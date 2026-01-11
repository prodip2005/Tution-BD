import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft } from 'react-icons/fa';

const testimonials = [
    { name: 'Sarah Johnson', role: 'Student', text: 'Found the perfect math tutor within 24 hours. Highly recommended!', image: "https://i.pravatar.cc/150?img=1" },
    { name: 'Michael Chen', role: 'Parent', text: 'My son\'s grades improved significantly after using TutorOWL.', image: "https://i.pravatar.cc/150?img=2" },
    { name: 'Emily Davis', role: 'Tutor', text: 'Great platform for finding motivated students. The interface is amazing.', image: "https://i.pravatar.cc/150?img=5" },
];

const TestimonialsSection = () => {
    // Infinite Scroll Animation variants
    const marqueeVariants = {
        animate: {
            x: [0, -1000],
            transition: {
                x: {
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 20,
                    ease: "linear",
                },
            },
        },
    };

    return (
        <div className="py-24 bg-transparent relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/10 rounded-full blur-[100px] pointer-events-none opacity-50"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10 mb-16 text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-4 uppercase italic tracking-tighter text-base-content">Success <span className="text-primary">Stories</span></h2>
                <div className="h-1 w-20 bg-primary mx-auto rounded-full shadow-[0_0_10px_currentColor]"></div>
            </div>

            <div className="relative w-full overflow-hidden mask-linear-fade">
                {/* Gradient Masks for smooth fade in/out */}
                <div className="absolute inset-y-0 left-0 w-20 md:w-40 z-20 bg-linear-to-r from-base-100 dark:from-[#020617] to-transparent pointer-events-none"></div>
                <div className="absolute inset-y-0 right-0 w-20 md:w-40 z-20 bg-linear-to-l from-base-100 dark:from-[#020617] to-transparent pointer-events-none"></div>

                <motion.div
                    className="flex gap-8 w-max"
                    variants={marqueeVariants}
                    animate="animate"
                >
                    {[...testimonials, ...testimonials, ...testimonials].map((item, index) => (
                        <div
                            key={index}
                            className="w-[350px] md:w-[450px] p-8 rounded-[2.5rem] bg-base-200 dark:bg-white/5 backdrop-blur-xl border border-base-300 dark:border-white/10 hover:border-primary/30 transition-all hover:bg-base-300 dark:hover:bg-white/10 shrink-0"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <img src={item.image} alt={item.name} className="w-14 h-14 rounded-full border-2 border-primary/50 shadow-lg object-cover" />
                                    <div>
                                        <h4 className="font-black text-lg text-base-content tracking-tight leading-tight">{item.name}</h4>
                                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">{item.role}</p>
                                    </div>
                                </div>
                                <FaQuoteLeft className="text-3xl text-primary/20" />
                            </div>

                            <p className="text-lg italic text-base-content/80 font-medium leading-relaxed">"{item.text}"</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
};

export default TestimonialsSection;
