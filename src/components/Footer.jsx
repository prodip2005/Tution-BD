import React from 'react';
import { motion } from 'framer-motion';
import { FiFacebook, FiYoutube, FiGithub, FiInstagram } from 'react-icons/fi';

const Footer = () => {
    // Twitter (X) New Logo
    const XLogo = () => (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
        </svg>
    );

    return (
        <footer className="relative bg-[#080808] border-t border-white/5 py-10 overflow-hidden">
            {/* Minimal Background Glow */}
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-center gap-8">

                    {/* Brand & Tagline */}
                    <div className="flex flex-col items-center md:items-start gap-3 text-center md:text-left">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <span className="text-white font-black text-lg">T</span>
                            </div>
                            <h2 className="text-xl font-black text-white tracking-tighter uppercase italic">
                                Tutor<span className="text-indigo-500 font-bold">Hub</span>
                            </h2>
                        </div>
                        <p className="text-gray-500 text-xs font-medium max-w-[250px]">
                            Empowering future leaders through professional mentorship.
                        </p>
                    </div>

                    {/* Compact Links */}
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
                        <a href="#" className="hover:text-indigo-500 transition-colors">Contact</a>
                    </div>

                    {/* Social Icons */}
                    <div className="flex gap-3">
                        {[
                            { icon: <XLogo />, link: "#" },
                            { icon: <FiFacebook size={18} />, link: "#" },
                            { icon: <FiYoutube size={18} />, link: "#" },
                            { icon: <FiGithub size={18} />, link: "#" }
                        ].map((social, index) => (
                            <motion.a
                                key={index}
                                href={social.link}
                                whileHover={{ scale: 1.1, y: -2 }}
                                className="w-9 h-9 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center text-gray-400 hover:text-white hover:bg-indigo-600 transition-all"
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Bottom Divider & Copyright */}
                <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                        © 2025 TutorHub. All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-1.5 text-[9px] text-gray-600 font-black uppercase tracking-widest">
                        Handcrafted with <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-red-600">❤</motion.span> by Your Team
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;