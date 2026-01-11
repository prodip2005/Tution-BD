import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import LatestTutionPost from './LatestTutionPost';
import LatestTutors from './LatestTutors';
import HowItWorks from './HowItWorks';
import WhyChooseUs from './WhyChooseUs';
import StatsSection from './StatsSection';
import CategoriesSection from './CategoriesSection';
import TestimonialsSection from './TestimonialsSection';
import FAQSection from './FAQSection';
import NewsletterSection from './NewsletterSection';
import { motion, AnimatePresence } from 'framer-motion';

const Home = () => {
    const [isLoading, setIsLoading] = useState(true);

    // সিমুলেটিং লোডিং টাইম (সাধারণত ইমেজ বা কন্টেন্ট লোড হওয়ার জন্য)
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 1500); // ১.৫ সেকেন্ড পর কন্টেন্ট দেখাবে
        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <div className="fixed inset-0 z-100 flex flex-col justify-center items-center bg-[#050505]">
                <div className="relative flex items-center justify-center">
                    {/* Outer Glow Ring */}
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-48 h-48 bg-primary/20 rounded-full blur-3xl"
                    />

                    {/* Orbital Rings */}
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-[3px] border-primary/10 border-t-primary rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute w-20 h-20 border-[3px] border-dashed border-primary/30 rounded-full"
                    />

                    {/* Inner Core */}
                    <motion.div
                        animate={{ scale: [0.8, 1.1, 0.8] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-12 h-12 bg-gradient-to-tr from-primary to-secondary rounded-2xl shadow-lg shadow-primary/40 flex items-center justify-center rotate-45"
                    >
                        <div className="w-4 h-4 bg-white rounded-full animate-ping" />
                    </motion.div>
                </div>

                {/* Stylish Loading Text */}
                <div className="mt-16 text-center">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-[0.4em] italic"
                    >
                        Tutor<span className="text-primary">OWL</span>
                    </motion.h2>
                    <motion.div className="flex items-center justify-center gap-1 mt-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ y: [0, -5, 0], opacity: [0.3, 1, 0.3] }}
                                transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                                className="w-1.5 h-1.5 bg-primary rounded-full"
                            />
                        ))}
                    </motion.div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className='pt-8 pb-8'
        >
            <HeroSection />
            <StatsSection />
            <CategoriesSection />
            <LatestTutionPost />
            <LatestTutors />
            <TestimonialsSection />
            <HowItWorks />
            <WhyChooseUs />
            <FAQSection />
            <NewsletterSection />
        </motion.div>
    );
};

export default Home;