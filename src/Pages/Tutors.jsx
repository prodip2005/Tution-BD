import React from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router";
import useAxiosSecure from "../Hooks/useAxiosSecure";

// আধুনিক এবং ক্লিন আইকনস (Lucide React)
import {
    LuUser,
    LuGraduationCap,
    LuMail,
    LuEye,
    LuHash,
    LuLayoutGrid,
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

    // --- Modern Cyber Loader ---
    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[70vh] bg-transparent">
                <div className="relative flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
                        className="w-32 h-32 border-2 border-indigo-500/10 border-t-indigo-500 rounded-full"
                    />
                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute w-24 h-24 border border-dashed border-indigo-400/20 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(79,70,229,0.5)]"
                    >
                        <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                    </motion.div>
                </div>
                <div className="mt-12 flex flex-col items-center gap-3">
                    <motion.p
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="text-indigo-400 text-[10px] font-black tracking-[0.6em] uppercase italic"
                    >
                        Fetching Experts
                    </motion.p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

            {/* --- Header Section --- */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
                <div className="text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center md:justify-start gap-2 mb-2"
                    >
                        <span className="h-[2px] w-8 bg-primary rounded-full inline-block"></span>
                        <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Professional Network</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white tracking-tighter uppercase italic"
                    >
                        Our <span className="text-primary not-italic">Elite</span> Tutors
                    </motion.h2>
                    <p className="mt-2 text-gray-500 font-bold italic flex items-center gap-2 justify-center md:justify-start">
                        <LuShieldCheck className="text-primary" /> Verified educators ready to guide your journey.
                    </p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center gap-4 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-8 py-4 rounded-[2rem] shadow-xl"
                >
                    <div className="p-3 bg-primary/10 text-primary rounded-2xl">
                        <LuUsers size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Active Mentors</p>
                        <p className="text-2xl font-black text-gray-900 dark:text-white leading-none">{tutors.length}</p>
                    </div>
                </motion.div>
            </div>

            {/* --- Table Container --- */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden bg-white/40 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-white dark:border-white/10 shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)]"
            >
                <div className="overflow-x-auto">
                    <table className="table w-full border-separate border-spacing-y-4 px-6 pb-6">
                        {/* Table Head */}
                        <thead>
                            <tr className="text-gray-400 uppercase text-[10px] tracking-[0.2em] font-black border-none">
                                <th className="bg-transparent pl-8"><div className="flex items-center gap-2"><LuHash size={14} className="text-primary" /> ID</div></th>
                                <th className="bg-transparent"><div className="flex items-center gap-2"><LuUser size={14} className="text-primary" /> Profile</div></th>
                                <th className="bg-transparent"><div className="flex items-center gap-2"><LuMail size={14} className="text-primary" /> Contact info</div></th>
                                <th className="bg-transparent"><div className="flex items-center gap-2"><LuGraduationCap size={14} className="text-primary" /> Affiliation</div></th>
                                <th className="bg-transparent text-right pr-8">Actions</th>
                            </tr>
                        </thead>

                        {/* Table Body */}
                        <tbody>
                            <AnimatePresence>
                                {tutors.map((tutor, index) => (
                                    <motion.tr
                                        key={tutor._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="group bg-white dark:bg-white/[0.03] hover:bg-primary/[0.02] dark:hover:bg-primary/[0.05] transition-all shadow-sm hover:shadow-md"
                                    >
                                        <td className="p-6 pl-8 font-mono text-xs text-gray-400 rounded-l-[2.5rem]">
                                            {String(index + 1).padStart(2, '0')}
                                        </td>

                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="relative">
                                                    <img
                                                        src={tutor.image || "https://i.ibb.co/2FsfXqM/avatar.png"}
                                                        alt="tutor"
                                                        className="w-14 h-14 rounded-2xl object-cover ring-4 ring-gray-50 dark:ring-white/5 group-hover:ring-primary/20 transition-all shadow-lg"
                                                    />
                                                    <div className="absolute -top-1 -right-1 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white dark:border-gray-900"></span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-black text-gray-900 dark:text-white group-hover:text-primary transition-colors text-base italic leading-tight">
                                                        {tutor.name || "Anonymous"}
                                                    </span>
                                                    <span className="text-[9px] uppercase font-black tracking-widest text-gray-400">Expert Tutor</span>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-100 dark:border-white/5 text-sm font-bold text-gray-600 dark:text-gray-400">
                                                {tutor.email}
                                            </div>
                                        </td>

                                        <td className="p-6">
                                            <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest inline-flex items-center gap-2 border shadow-sm ${tutor.institution
                                                ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20"
                                                : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                                                }`}>
                                                <LuGraduationCap size={14} />
                                                {tutor.institution || "Private Practice"}
                                            </div>
                                        </td>

                                        <td className="p-6 text-right pr-8 rounded-r-[2.5rem]">
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => navigate(`/tutors/${tutor.email}`)}
                                                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-2xl hover:bg-primary dark:hover:bg-primary dark:hover:text-white transition-all shadow-lg"
                                            >
                                                Details <LuArrowRight size={16} />
                                            </motion.button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {tutors.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-32 text-center bg-transparent">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <LuSearchX size={64} className="mb-4 text-primary" />
                                            <p className="text-xl font-black uppercase tracking-[0.4em] italic">No Experts Found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </div>
    );
};

export default Tutors;