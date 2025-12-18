import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router';
import Footer from '../components/Footer';
import ScrollProgress from '../Animation/ScrollProgress';
import { motion } from 'framer-motion';

const RootLayout = () => {
    return (
        <div className='min-h-screen flex flex-col overflow-x-hidden relative bg-slate-50 dark:bg-gray-950 transition-colors duration-500'>

            {/* --- Stylish Animated & Color Changing Blobs --- */}
            <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">

                {/* 1st Blob: Dynamic Color & Motion */}
                <motion.div
                    animate={{
                        x: [0, 150, -100, 0],
                        y: [0, 80, 150, 0],
                        scale: [1, 1.3, 0.9, 1],
                        backgroundColor: ["rgba(59, 130, 246, 0.15)", "rgba(168, 85, 247, 0.15)", "rgba(236, 72, 153, 0.15)", "rgba(59, 130, 246, 0.15)"]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[5%] -left-[5%] w-[45%] h-[45%] rounded-full blur-[100px] md:blur-[130px]"
                />

                {/* 2nd Blob: Dynamic Color & Motion */}
                <motion.div
                    animate={{
                        x: [0, -120, 100, 0],
                        y: [0, 150, -50, 0],
                        scale: [1, 1.2, 1.1, 1],
                        backgroundColor: ["rgba(34, 197, 94, 0.12)", "rgba(59, 130, 246, 0.12)", "rgba(234, 179, 8, 0.12)", "rgba(34, 197, 94, 0.12)"]
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[20%] -right-[5%] w-[40%] h-[40%] rounded-full blur-[100px] md:blur-[120px]"
                />

                {/* 3rd Blob: Dynamic Color & Motion */}
                <motion.div
                    animate={{
                        x: [0, 100, -80, 0],
                        y: [0, -120, 80, 0],
                        backgroundColor: ["rgba(249, 115, 22, 0.1)", "rgba(236, 72, 153, 0.1)", "rgba(168, 85, 247, 0.1)", "rgba(249, 115, 22, 0.1)"]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] rounded-full blur-[100px] md:blur-[110px]"
                />
            </div>

            {/* --- Content Area --- */}
            <div className="relative z-10 flex flex-col min-h-screen">
                <ScrollProgress />

                <Navbar />

                {/* Main Content with pt and w-full for HeroSection support */}
                <main className='flex-1 pt-24 md:pt-28 lg:pt-32 w-full'>
                    <motion.div
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="w-full"
                    >
                        <Outlet />
                    </motion.div>
                </main>

                <Footer />
            </div>

            {/* Global Smoothness Styles */}
            <style dangerouslySetInnerHTML={{
                __html: `
                body {
                    background-attachment: fixed;
                }
                ::-webkit-scrollbar {
                    width: 7px;
                }
                ::-webkit-scrollbar-track {
                    background: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    background: #3b82f6;
                    border-radius: 20px;
                }
                .dark ::-webkit-scrollbar-thumb {
                    background: #2563eb;
                }
            `}} />
        </div>
    );
};

export default RootLayout;