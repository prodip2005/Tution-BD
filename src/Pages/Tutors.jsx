import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// আধুনিক এবং ক্লিন আইকনস
import {
    LuUser,
    LuGraduationCap,
    LuMail,
    LuHash,
    LuArrowRight,
    LuShieldCheck,
    LuUsers,
    LuSearchX
} from "react-icons/lu";

const Tutors = () => {
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();

    const { data: tutors = [], isLoading } = useQuery({
        queryKey: ["tutors"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users?role=tutor");
            return res.data.users || [];
        },
    });

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-base-100 dark:bg-gray-950">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-24 h-24 md:w-32 md:h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-8 h-8 md:w-10 md:h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    />
                </div>
                <div className="mt-8 md:mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-primary text-[10px] font-black tracking-[0.4em] uppercase italic px-4 text-center"
                    >
                        Fetching Experts
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-base-100 dark:bg-gray-950 text-base-content pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

                {/* --- Header Section --- */}
                <div className="flex flex-col md:flex-row items-center justify-between mb-10 md:mb-16 gap-6 md:gap-8">
                    <div className="text-center md:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center md:justify-start gap-2 mb-2"
                        >
                            <span className="h-[2px] w-6 md:w-8 bg-primary rounded-full inline-block"></span>
                            <span className="text-primary font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-[9px] md:text-[10px]">Professional Network</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-3xl md:text-7xl font-black text-base-content tracking-tighter uppercase italic leading-tight"
                        >
                            Our <span className="text-primary not-italic">Elite</span> Tutors
                        </motion.h2>
                        <p className="mt-4 text-base-content/60 font-bold italic flex items-center gap-2 justify-center md:justify-start text-xs md:text-base uppercase tracking-widest">
                            <LuShieldCheck className="text-primary shrink-0" /> Verified educators ready to guide you.
                        </p>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-4 bg-base-200/50 border border-base-300 dark:border-white/10 px-6 py-3 md:px-8 md:py-4 rounded-3xl shadow-2xl backdrop-blur-xl"
                    >
                        <div className="p-2 md:p-3 bg-primary/10 text-primary rounded-xl md:rounded-2xl">
                            <LuUsers size={24} />
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black text-base-content/60 uppercase tracking-widest leading-none mb-1">Active Mentors</p>
                            <p className="text-xl md:text-3xl font-black text-base-content leading-none">{tutors.length}</p>
                        </div>
                    </motion.div>
                </div>

                {/* --- Grid Layout (Unified) --- */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    <AnimatePresence>
                        {tutors.map((tutor, index) => (
                            <motion.div
                                key={tutor._id || index}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.2, delay: index * 0.05 }}
                                onClick={() => navigate(`/tutors/${tutor.email}`)}
                                className="group relative bg-base-100 dark:bg-base-200/40 border border-base-200 dark:border-white/5 rounded-3xl p-5 shadow-lg hover:shadow-2xl hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-300 flex flex-col h-full cursor-pointer overflow-hidden"
                            >
                                {/* Hover Effect Gradient */}
                                <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                <div className="flex items-center gap-4 mb-4 z-10">
                                    <div className="relative">
                                        <img
                                            src={tutor.image || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                            className="w-16 h-16 rounded-2xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300"
                                            alt={tutor.name}
                                        />
                                        <div className="absolute -bottom-1 -right-1 bg-base-100 rounded-full p-[2px]">
                                            <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-base-100"></div>
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-black text-base-content text-lg italic tracking-tight truncate group-hover:text-primary transition-colors">
                                            {tutor.name || "Anonymous"}
                                        </h3>
                                        <p className="text-[10px] font-bold text-base-content/50 uppercase tracking-wider truncate">
                                            Expert Tutor
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-6 z-10 flex-1">
                                    <div className="flex items-center gap-3 text-xs font-bold text-base-content/70 bg-base-200/50 dark:bg-black/20 p-2 rounded-xl">
                                        <LuMail className="text-primary shrink-0" />
                                        <span className="truncate">{tutor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-xs font-bold text-base-content/70 bg-base-200/50 dark:bg-black/20 p-2 rounded-xl">
                                        <LuGraduationCap className="text-primary shrink-0" />
                                        <span className="truncate">{tutor.institution || "N/A"}</span>
                                    </div>
                                </div>

                                <div className="pt-4 mt-auto border-t border-base-200 dark:border-white/5 z-10">
                                    <button className="w-full py-3 bg-primary text-white font-black text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-primary/20 group-hover:bg-primary-focus transition-all flex items-center justify-center gap-2">
                                        View Profile <LuArrowRight size={14} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {tutors.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center opacity-20">
                            <LuSearchX size={64} className="mb-4 text-primary" />
                            <p className="text-xl font-black uppercase tracking-[0.4em] italic text-base-content">No Experts Found</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tutors;